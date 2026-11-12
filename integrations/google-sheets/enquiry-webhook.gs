/**
 * Star Managed Farmlands — enquiry form → Google Sheet webhook.
 *
 * Setup (once):
 *   1. Create a Google Sheet. Extensions › Apps Script. Replace Code.gs with this file.
 *   2. Project Settings › Script Properties:
 *        ENQUIRY_SECRET = a long random string (same value as ENQUIRY_SHEET_SECRET in the website env)
 *        NOTIFY_EMAIL   = (optional) address to email on every new enquiry
 *   3. Deploy › New deployment › Web app. Execute as: Me. Who has access: Anyone.
 *   4. Copy the /exec URL into the website env as ENQUIRY_SHEET_WEBHOOK_URL.
 *   After editing this script later, use Deploy › Manage deployments › Edit › New version
 *   so the same URL keeps working.
 */

var HEADERS = ["Submitted at", "Full name", "Phone", "Email", "Purpose", "Plots", "Budget", "Site visit", "Interested in", "Notes", "Page"];
var SHEET_NAME = "Enquiries";

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "bad-json" });
  }
  if (!props.getProperty("ENQUIRY_SECRET") || data.secret !== props.getProperty("ENQUIRY_SECRET")) {
    return json({ ok: false, error: "unauthorised" });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    var submitted = data.submittedAt ? new Date(data.submittedAt) : new Date();
    sheet.appendRow([
      submitted,
      safe(data.name),
      safe(data.phone),
      safe(data.email),
      safe(data.purpose),
      safe(data.plots),
      safe(data.budget),
      safe(data.visit),
      safe(data.interest),
      safe(data.note),
      safe(data.page),
    ]);
  } finally {
    lock.releaseLock();
  }

  var notify = props.getProperty("NOTIFY_EMAIL");
  if (notify) {
    try {
      MailApp.sendEmail({
        to: notify,
        subject: "New Coorg plot enquiry: " + String(data.name || "").slice(0, 80),
        body: [
          "Full name: " + data.name,
          "Phone: " + data.phone,
          "Email: " + data.email,
          "Purpose: " + data.purpose,
          "Plots: " + data.plots,
          "Budget: " + data.budget,
          "Site visit: " + data.visit,
          "Interested in: " + (data.interest || "-"),
          "Notes: " + (data.note || "-"),
          "Page: " + (data.page || "-"),
        ].join("\n"),
      });
    } catch (err) {
      // The row is saved; a mail quota error should not fail the submission.
    }
  }

  return json({ ok: true });
}

// Values starting with = + - @ would be run as formulas (and "+91…" phone
// numbers would break), so store them as plain text.
function safe(value) {
  var text = value == null ? "" : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

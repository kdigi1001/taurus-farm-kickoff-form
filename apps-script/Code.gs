/**
 * Taurus Farm kickoff form -> Google Doc receiver.
 * Paste this into a Google Apps Script project, deploy as a Web app
 * (Execute as: Me, Who has access: Anyone), and put the /exec URL
 * into ENDPOINT in index.html.
 */
var DOC_ID = '1MeyL7juOH4aK9cc3QanyalB5B0kDao9D2mXAQw0bASo';

var FIELDS = [
  ['business', 'Business Name'],
  ['address', 'Business Address'],
  ['phone', 'Business Contact Number'],
  ['email', 'Email Address'],
  ['offers', 'Business Offers'],
  ['projects', 'Business Future Projects'],
  ['events', 'Business Future Events']
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var raw = (e && e.postData && e.postData.contents) || '';
    if (!raw || raw.length > 30000) return reply_({ ok: false, error: 'bad size' });
    var data = JSON.parse(raw);
    if (data.website) return reply_({ ok: true }); // honeypot: bots fill this in

    var answers = data.answers || {};
    lock.waitLock(20000);

    var body = DocumentApp.openById(DOC_ID).getBody();
    var stamp = Utilities.formatDate(new Date(), 'Asia/Manila', 'MMM d, yyyy h:mm a');
    var name = String(answers.business || 'Unnamed').slice(0, 120);

    body.appendHorizontalRule();
    body.appendParagraph('Response: ' + name + ' (' + stamp + ' PHT)')
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);

    FIELDS.forEach(function (f) {
      var val = String(answers[f[0]] || '').trim().slice(0, 8000);
      var label = body.appendParagraph(f[1]);
      label.setHeading(DocumentApp.ParagraphHeading.NORMAL).setBold(true);
      body.appendParagraph(val || 'Not answered').setBold(false);
    });

    DocumentApp.openById(DOC_ID).saveAndClose();
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return reply_({ ok: true, service: 'taurus-kickoff-receiver' });
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to test: appends a sample response to the doc. */
function testAppend() {
  doPost({ postData: { contents: JSON.stringify({ answers: {
    business: 'TEST - Taurus Farm', address: 'Test address', phone: '0900 000 0000',
    email: 'test@example.com', offers: 'Test offers', projects: 'Test projects', events: 'Test events'
  } }) } });
}

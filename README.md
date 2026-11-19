# Taurus Farm kickoff form

A one-page web form for Taurus Farm Pickleball Court. Answers are appended to the Google Doc
"Taurus Farm × katha — Kickoff Responses". This is its own project, separate from any Taurus website.

```
index.html            the form (static page, host on GitHub Pages)
apps-script/Code.gs   receiver that writes each submission into the Google Doc
```

## How it works

A static page cannot write to Google Docs by itself. The form posts to a small Google Apps Script
web app that runs as the Doc owner and appends each response to the Doc.

## Setup (one time, about 5 minutes)

1. Open the answers Doc, then **Extensions → Apps Script**.
2. Replace the editor contents with [`apps-script/Code.gs`](apps-script/Code.gs). `DOC_ID` is already set.
3. Run `testAppend` once and approve the permissions. Check that a TEST response appears in the Doc, then delete it.
4. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Copy the `/exec` URL.
5. In `index.html`, set `var ENDPOINT = "<the /exec URL>";`, commit and push.
6. Repo **Settings → Pages**: deploy from branch `main`, folder `/ (root)`. Send Taurus the Pages URL.

Until `ENDPOINT` is set, the form falls back to showing the answers as text to copy and send.

## Notes

- Browsers cannot read the Apps Script reply (`no-cors`), so the page shows "Thank you" once the request is sent.
  Always send one test submission yourself and confirm it lands in the Doc.
- If you change `Code.gs`, redeploy with **Manage deployments → Edit → New version**; the URL stays the same.
- The Apps Script URL is public by design. The script only appends to that one Doc and caps input size.

'use strict';

const qs = require('querystring');

function sendHtml(res, html) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length' , Buffer.byteLength(html));
  res.end(html);
};

function parseReceivedData(req, callback) {
  let body = '';
  req.setEncoding('utf8');

  req.on('data', (chunk) => body += chunk);
  req.on('end', () => callback(qs.parse(body)));
};

function actionForm(id, path, label) {
  return `
    <form method="post" action="${path}">
    <input type="hidden" name="id" value="${id}">
    <input type="submit" value="${label}">
    </form>
  `;
};

function workHitlistHtml(rows) {
  const tableRows = rows.map((row) => {
    return `
      <tr>
        <td>${row.date}</td>
        <td>${row.hours}</td>
        <td>${row.description}</td>
        <td>${row.archived ? '' : workArchiveForm(row.id)}</td>
        <td>${workDeleteForm(row.id)}</td>
      </tr>
    `
  });

  return `<table><tbody>${tableRows.join('')}</tbody></table>`;
}

function workFormHtml() {
  return `
    <form method="POST" action="/">
      <p>Date (YYYY-MM-DD):<br /> <input name="date" type="text"></p>
      <p>Hours worked:<br /> <input name="hours" type="text"></p>
      <p>Description:<br /><textarea name="description"></textarea></p>
      <input type="submit" value="Add" />
    </form>
  `;
}

function workArchiveForm(id) {
  return actionForm(id, '/archive', 'Archive');
}

function workDeleteForm(id) {
  return actionForm(id, '/delete', 'Delete');
}

exports.add = (db, req, res) => {
  parseReceivedData(req, (data) => {
    db.query(
      'INSERT INTO work (hours, date, description) VALUES (?, ?, ?)',
      [data.hours, data.date, data.description],
      (err) => {
        if(err) throw err;
        exports.show(db, res);
      }
    );
  })
};

exports.archive = (db, req, res) => {
  parseReceivedData(req, (data) => {
    db.query(
      'UPDATE work SET archived = 1 WHERE id = ?',
      [data.id],
      (err) => {
        if(err) throw err;
        exports.show(db, res);
      }
    );
  })
};

exports.delete = (db, req, res) => {
  parseReceivedData(req, (data) => {
    db.query(
      'DELETE FROM work WHERE id = ?',
      [data.id],
      (err) => {
        if(err) throw err;
        exports.show(db, res);
      }
    );
  })
};

exports.show = (db, res, showArchived) => {
  db.query(
    `SELECT * FROM work WHERE archived = ? ORDER BY date DESC`,
    [showArchived ? 1 : 0],
    (err, rows) => {
      if(err) throw err;

      let html = showArchived ? '' : '<a href="/archived">Archived Work<br/></a>';
      html += workHitlistHtml(rows);
      html += workFormHtml();

      sendHtml(res, html);
    }
  );
};

exports.showArchived = (db, res) => {
  exports.show(db, res, true);
};




/** @format */

const post_req = (score) => {
  new Promise((resolve, reject) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Bearer 16c2a98170f1cba5147e23e3f31a0ece2e1ab91aece20b41d9ed725cd918860d'
      );
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

      var urlencoded = new URLSearchParams();
      urlencoded.append('score', score);
      urlencoded.append('', '');

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow',
      };

      fetch(
        'https://scorelogger.harshbajpai1.repl.co/update_score',
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));

      resolve();
    } catch {
      reject();
    }
  });
};

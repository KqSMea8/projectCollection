export default function getJSON({ url }) {
  const xhr = new Promise((resolve, reject) => {
    let xmlhttp;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new window.XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const text = xmlhttp.responseText;
          try {
            const data = JSON.parse(text);
            resolve(data);
          } catch (ex) {
            reject(ex);
          }
        } else {
          reject();
        }
      }
    };

    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  });

  return xhr;
}

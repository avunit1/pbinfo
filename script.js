function makeHttpObject() {
    try {
        return new XMLHttpRequest();
    } catch (error) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (error) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (error) {}

    throw new Error("Could not create HTTP request object.");
}

document.getElementById('pbinfoForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const url = `https://corsproxy.io/https://www.pbinfo.ro/profil/${username}`;

    const resultContent = document.querySelector('.result-content');

    resultContent.style.animation = 'flash 0.5s linear infinite'; 
    resultContent.innerText = '...'; 

    var request = makeHttpObject();
    request.open("GET", url, true); 
    request.send(null); 

    request.onreadystatechange = function () {
        if (request.readyState === 4) { 
            resultContent.style.animation = 'none'; 
            if (request.status === 200) { 
                const responseText = request.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(responseText, 'text/html');
                const problemLink = doc.querySelector('a[href*="profil/' + username + '/probleme"]');
                if (problemLink) {
                    const textContent = problemLink.textContent; 
                    const numberOfProblems = textContent.match(/(\d+)/); 
                    if (numberOfProblems) {
                        console.log('Number of Probleme Rezolvate: ', numberOfProblems[0]);
                        resultContent.innerText = numberOfProblems[0]; 
                        if (username.toLowerCase() === 'avunit') {
                            resultContent.style.color = '#d4af37'; 
                        } else {
                            resultContent.style.color = '#50C878'; 
                        }
                    } else {
                        console.log('No number found in the link text.');
                        resultContent.innerText = 'Eroare link';
                        resultContent.style.color = '#FF2400'; 
                    }
                } else {
                    console.log('No link found for problems.');
                    resultContent.innerText = 'Eroare probleme';
                    resultContent.style.color = '#FF2400'; 
                }
            } else {
                console.error('There was an error fetching the profile. Status:', request.status);
                resultContent.innerText = 'Eroare profil'; // pentru utilizatorul "fif" returneaza tot timpul eroare deoarece nu este logat
                resultContent.style.color = '#FF2400'; 
            }
        }
    };
});

document.getElementById('classButton').addEventListener('click', function () {
    window.location.href = 'clasa9a.html';
});

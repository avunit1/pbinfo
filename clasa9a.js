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

window.addEventListener('load', function() {
    fetch('clasa9a.json')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const results = [];
                let completedRequests = 0;
                data.forEach((user, index) => {
                    setTimeout(() => {
                        fetchProblemData(user.username, user.name, results, () => {
                            completedRequests++;
                            if (completedRequests === data.length) {
                                displayResults(results);
                            }
                        });
                    }, index * 50); // delay de 50
                });
            }
        })
        .catch(error => console.error('Error loading JSON:', error));
});

function fetchProblemData(username, name, results, callback) {
    const url = `https://proxy.cors.sh/?https://www.pbinfo.ro/profil/${username}`;

    var request = makeHttpObject();
    request.open("GET", url, true);
    request.send(null);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const responseText = request.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(responseText, 'text/html');
                const problemLink = doc.querySelector('a[href*="profil/' + username + '/probleme"]');
                let numberOfProblems = 0;
                if (problemLink) {
                    const textContent = problemLink.textContent;
                    const match = textContent.match(/(\d+)/);
                    numberOfProblems = match ? parseInt(match[0], 10) : 0;
                }
                const resultText = numberOfProblems > 0 ? 
                    `<span class="user-name">${name}: </span><span class="problem-count">${numberOfProblems}</span>` : 
                    `<span class="user-name">${name}: </span><span style="color: #ff2400;">Eroare link</span>`;
                results.push({ name, resultText, numberOfProblems });
            } else {
                results.push({ name, resultText: `<span class="user-name">${name}: </span><span style="color: #ff2400;">Eroare</span>`, numberOfProblems: 0 });
            }
            callback();
        }
    };
}

function displayResults(results) {
    const resultContent = document.querySelector('.result-content');
    resultContent.classList.remove('loading');
    results.sort((a, b) => b.numberOfProblems - a.numberOfProblems);
    resultContent.innerHTML = results.map(result => `<div>${result.resultText}</div>`).join('');
}

document.getElementById('classButton').addEventListener('click', function () {
    window.location.href = 'index.html';
});

// Function to create an HTTP request object for multiple browsers
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

// Event listener for form submission
document.getElementById('pbinfoForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the username input by the user
    const username = document.getElementById('username').value;
    const url = `https://cors-anywhere.herokuapp.com/https://www.pbinfo.ro/profil/${username}`; // URL with the CORS proxy

    // Get result content element
    const resultContent = document.querySelector('.result-content');

    // Start flashing animation
    resultContent.style.animation = 'flash 0.5s linear infinite'; // Add flash animation
    resultContent.innerText = '...'; // Set to placeholder text

    // Create the HTTP request
    var request = makeHttpObject();
    request.open("GET", url, true); // Asynchronous GET request
    request.send(null); // Send the request with no data

    // Handle the response
    request.onreadystatechange = function () {
        if (request.readyState === 4) { // Request is completed
            resultContent.style.animation = 'none'; // Stop the animation

            if (request.status === 200) { // Successful request
                const responseText = request.responseText;

                // Create a temporary DOM element to parse the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(responseText, 'text/html');

                // Find the anchor element that contains the number of problems
                const problemLink = doc.querySelector('a[href*="profil/' + username + '/probleme"]');

                if (problemLink) {
                    // Extract the number of problems from the text
                    const textContent = problemLink.textContent; // Get the text content of the anchor
                    const numberOfProblems = textContent.match(/(\d+)/); // Match the number using regex

                    if (numberOfProblems) {
                        console.log('Number of Probleme Rezolvate: ', numberOfProblems[0]);
                        resultContent.innerText = numberOfProblems[0]; // Update with number of problems
                        resultContent.style.color = '#ffffff'; // Change color to white
                    } else {
                        console.log('No number found in the link text.');
                        resultContent.innerText = 'Numărul de probleme nu a fost găsit.';
                        resultContent.style.color = '#404040'; // Keep it gray
                    }
                } else {
                    console.log('No link found for problems.');
                    resultContent.innerText = 'Nu s-au găsit probleme rezolvate.';
                    resultContent.style.color = '#404040'; // Keep it gray
                }
            } else {
                console.error('There was an error fetching the profile. Status:', request.status);
                resultContent.innerText = 'Eroare la obținerea profilului.';
                resultContent.style.color = '#404040'; // Keep it gray
            }
        }
    };
});

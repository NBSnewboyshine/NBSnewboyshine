// script.js
document.addEventListener('DOMContentLoaded', () => {
    const contacts = []; // This will hold contact names
    const contactListElement = document.getElementById('contact-list');
    const contactSelectorListElement = document.getElementById('contact-selector-list');

    // Function to update contact list in UI
    function updateContactList() {
        contactListElement.innerHTML = '';
        contactSelectorListElement.innerHTML = '';
        contacts.forEach(contact => {
            // Add contact to the contact list
            const li = document.createElement('li');
            li.textContent = contact;
            contactListElement.appendChild(li);
            
            // Add contact to the contact selector
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = contact;
            const label = document.createElement('label');
            label.textContent = contact;
            label.prepend(checkbox);
            const selectorLi = document.createElement('li');
            selectorLi.appendChild(label);
            contactSelectorListElement.appendChild(selectorLi);
        });
    }

    // Add a new contact
    document.getElementById('add-contact').addEventListener('click', () => {
        const contactName = document.getElementById('contact-input').value.trim();
        if (contactName && !contacts.includes(contactName)) {
            contacts.push(contactName);
            updateContactList();
            document.getElementById('contact-input').value = '';
        }
    });

    // Show contact selector
    document.getElementById('select-contacts').addEventListener('click', () => {
        document.getElementById('contact-selector').style.display = 'block';
    });

    // Start video call with selected contacts
    document.getElementById('confirm-selection').addEventListener('click', () => {
        const selectedContacts = Array.from(document.querySelectorAll('#contact-selector-list input:checked')).map(cb => cb.value);
        if (selectedContacts.length > 0) {
            // Start group call logic with selectedContacts
            console.log('Starting call with:', selectedContacts);
            document.getElementById('contact-selector').style.display = 'none';
            // Here you would start the group video call with selectedContacts
        }
    });

    // Example video call setup
    let localStream;
    let peerConnections = {}; // For handling multiple peers

    async function startVideoCall() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('local-video').srcObject = localStream;
            
            // Initialize peer connections for each selected contact
            const selectedContacts = contacts; // Replace with actual selected contacts
            selectedContacts.forEach(contact => {
                peerConnections[contact] = new RTCPeerConnection();
                localStream.getTracks().forEach(track => peerConnections[contact].addTrack(track, localStream));
                
                peerConnections[contact].ontrack = event => {
                    // Handle incoming tracks
                    // Update UI to display remote video streams
                };
                
                peerConnections[contact].onicecandidate = event => {
                    if (event.candidate) {
                        // Send ICE candidate to the remote peer
                    }
                };
            });
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    document.getElementById('start-call').addEventListener('click', startVideoCall);

    // End the video call
    document.getElementById('end-call').addEventListener('click', () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            document.getElementById('local-video').srcObject = null;
            document.getElementById('remote-video').srcObject = null;
        }
        Object.values(peerConnections).forEach(pc => pc.close());
        peerConnections = {};
    });
});










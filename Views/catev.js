
// Slider functionality
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventType = urlParams.get('id');
    const eventtype = document.getElementById("EVENT_TYPE");
    eventtype.textContent = eventType;
    fetch(`/events/${eventType}`)
        .then(res => res.json())
        .then(data => {
            const section = this.querySelector('.events-list');
            for (let i = 0; i < data.length; i++) {

                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.setAttribute('data-event-id', data[i].EVENT_ID);
                const eventImage = document.createElement('img');
                eventImage.src = `images/${eventType}.png`;
                eventImage.alt = 'evenType';
                eventCard.appendChild(eventImage);

                const eventContent = document.createElement('div');
                eventContent.className = 'event-content';
                eventCard.appendChild(eventContent);

                const eventTitle = document.createElement('div');
                eventTitle.className = 'event-title';
                eventTitle.textContent = data[i].EVENT_NAME;
                eventContent.appendChild(eventTitle);


                const eventDate = document.createElement('div');
                eventDate.className = 'event-date';
                eventDate.textContent = data[i].DATE_AND_TIME;
                eventContent.appendChild(eventDate);

                const eventloc = document.createElement('div');
                eventloc.className = 'event-loc';
                eventloc.textContent = data[i].location;
                eventContent.appendChild(eventloc);
                const eventDescription = document.createElement('div');
                eventDescription.className = 'event-description';
                eventDescription.textContent = 'Hand building & pottery wheel sessions. Includes complimentary drink!';
                eventContent.appendChild(eventDescription);

                // Append the event card to the selected section
                section.appendChild(eventCard);

                eventCard.addEventListener('click', function (event) {
                    const clickedEventId = this.getAttribute('data-event-id');
                    console.log(clickedEventId);
                    window.location.href = `eventdetails.html?id=${clickedEventId}`;
                })
            }
        });
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1])); 
         // const hey = document.getElementById("hey");
          const login_btn=document.getElementById('login_btn');
          const pElement = document.createElement("p");
          pElement.className = 'intro';
          pElement.textContent = `Hi ${payload.name}`;
        login_btn.replaceWith(pElement);
        //   const x = document.createElement("p");
        //   x.textContent = "";
          //login_buttons2.replaceWith(x);
          //hey.innerHTML = `<p>Hey! ${payload.name}</p>`;
        }
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            const input = { eventname: document.getElementById("searchInput").value };
            fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)

            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    console.log(data.Event_ID);
                    window.location.href = `eventdetails.html?id=${data.Event_ID}`;
                });

        }
    });
    const applyFilter=document.getElementById('applyFilters');
    console.log(applyFilter);
    applyFilter.addEventListener('click', function () {

        const filterdetails = {
            EventType: eventType,
            loc: document.getElementById('locationSelect').value,
            dat: document.getElementById('eventDate').value
        }
        console.log(filterdetails.location);
        
        fetch('/eventsfilter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterdetails)
        })
            .then(res => res.json())
            .then(data => {
               
              //  console.log(data);

                const section = document.querySelector('.events-list');
                section.innerHTML = '';
                console.log(section);
            for (let i = 0; i < data.length; i++) {

                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.setAttribute('data-event-id', data[i].EVENT_ID);
                const eventImage = document.createElement('img');
                eventImage.src = `images/${eventType}.png`;
                eventImage.alt = 'evenType';
                eventCard.appendChild(eventImage);

                const eventContent = document.createElement('div');
                eventContent.className = 'event-content';
                eventCard.appendChild(eventContent);

                const eventTitle = document.createElement('div');
                eventTitle.className = 'event-title';
                eventTitle.textContent = data[i].EVENT_NAME;
                eventContent.appendChild(eventTitle);


                const eventDate = document.createElement('div');
                eventDate.className = 'event-date';
                eventDate.textContent = data[i].DATE_AND_TIME;
                eventContent.appendChild(eventDate);

                const eventloc = document.createElement('div');
                eventloc.className = 'event-loc';
                eventloc.textContent = data[i].location;
                eventContent.appendChild(eventloc);
                const eventDescription = document.createElement('div');
                eventDescription.className = 'event-description';
                eventDescription.textContent = 'Hand building & pottery wheel sessions. Includes complimentary drink!';
                eventContent.appendChild(eventDescription);

                // Append the event card to the selected section
                section.appendChild(eventCard);

                eventCard.addEventListener('click', function (event) {
                    event.preventDefault();
                    const clickedEventId = this.getAttribute('data-event-id');
                    console.log(clickedEventId);
                    window.location.href = `eventdetails.html?id=${clickedEventId}`;
                });
            }

            });


    });


});
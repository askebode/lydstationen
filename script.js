        // Select all the links in the menu
        console.log("hej");
        const menuLinks = document.querySelectorAll('nav a');

        // Add a click event listener to each link
        menuLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        function shuffleList(list) {
            // get all the <li> elements inside the <ul> list
            const items = Array.from(list.querySelectorAll('li'));

            // shuffle the <li> elements using Fisher-Yates algorithm
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
            }

            // append the shuffled <li> elements back into the <ul> list
            items.forEach(item => list.appendChild(item));
        }
        // Smooth scroll function
        function smoothScroll(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const nav = document.querySelector('nav');
            const targetOffset = targetSection.offsetTop - nav.offsetHeight;
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        }

        const filterInputs = document.querySelectorAll('[name="job"]');
        const clientList = document.querySelector('#client-list');
        shuffleList(clientList);
        const clients = Array.from(clientList.children);

        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                const checkedInputs = Array.from(document.querySelectorAll('[name="' + input.name + '"]:checked'));
                clients.forEach(client => {
                    let shouldShow = false;
                    if (checkedInputs.length === 0) {
                        shouldShow = true;
                    } else {
                        checkedInputs.forEach(checkedInput => {
                            const checkedValues = checkedInput.value.split(' ');
                            let matchesValue = false;
                            checkedValues.forEach(value => {
                                if (client.dataset[checkedInput.name].includes(value)) {
                                    matchesValue = true;
                                }
                            });
                            if (matchesValue) {
                                shouldShow = true;
                            }
                        });
                    }
                    client.style.display = shouldShow ? 'list-item' : 'none';
                });
            });
        });

        const menu = document.querySelector('nav');
        const threshold = window.innerHeight / 2;

        window.addEventListener('scroll', () => {
            if (window.scrollY > threshold) {
                menu.classList.add('white');
            } else {
                menu.classList.remove('white');
            }
        });

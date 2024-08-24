document.addEventListener('DOMContentLoaded', function () {
    
    let tabUrl;

    // Set the current Tab URL
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        tabUrl=tab.url

        urlDisplay = document.getElementById('urlDisplay');
        urlDisplay.textContent=tabUrl
        // ..........
      })();

    // Show the things being hovered over
    document.addEventListener('mouseover', function (event) {
        
        // const debuggerId = document.getElementById('debuggerId');
        // const debuggerClass = document.getElementById('debuggerClass');
        // const newId = event.target.id
        // const newClass = event.target.classList
        // debuggerId.textContent="id : " + newId
        // debuggerClass.textContent="class : " + newClass
       

        // event.target.classList.add('highlighted')
        

    });

    document.addEventListener('mouseout', function (event) {
        // event.target.classList.remove('highlighted')
    });





    // Load urls from storage
    chrome.storage.sync.get(['urls'], function (result) {
        const urls = result.urls || [];
        updateTodoList(urls);
    });

    // Handle checkbox change
    document.getElementById('todoList').addEventListener('change',
        function (event) {
            const checkbox = event.target;
            const urlId = checkbox.dataset.id;

            // Update url as completed
            chrome.storage.sync.get(['urls'], function (result) {
                const urls = result.urls || [];
                const updatedurls = urls.map(url => {
                    if (url.id === urlId) {
                        url.completed = checkbox.checked;
                    }
                    return url;
                });

                // Save updated urls
                chrome.storage.sync.set({ 'urls': updatedurls });

                // Remove completed url after 2 seconds : .5s
                if (checkbox.checked) {
                    setTimeout(function () {
                        const updatedurls = urls
                            .filter(url => url.id !== urlId);
                        chrome.storage.sync.set({ 'urls': updatedurls });
                        updateTodoList(updatedurls);
                    }, 500);
                }
            });
        });

    // Add url on Enter key press
    document.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const input = document.getElementById('urlInput');
            const urlText = input.value.trim();
            if (urlText !== '') {
                chrome.storage.sync.get(['urls'], function (result) {
                    const urls = result.urls || [];
                    const newurl = {
                        id: Date.now().toString(),
                        text: urlText, completed: false
                    };
                    const updatedurls = [...urls, newurl];

                    chrome.storage.sync.set({ 'urls': updatedurls });
                    updateTodoList(updatedurls);
                    input.value = ''; // Clear input field
                });
            }
        }
    });


    function addurl(urlName){
        if (urlName !== '') {
            chrome.storage.sync.get(['urls'], function (result) {
                const urls = result.urls || [];
                const newurl = {
                    id: Date.now().toString(),
                    text: urlName, completed: false
                };
                const updatedurls = [...urls, newurl];
                chrome.storage.sync.set({ 'urls': updatedurls });
                updateTodoList(updatedurls);
            });
        }
    }




    // Show the things being hovered over
    document.addEventListener('mouseover', function (event) {
        // const debuggerId = document.getElementById('debuggerId');
        // const debuggerClass = document.getElementById('debuggerClass');
        // const debuggerValue=document.getElementById('debuggerValue');
        // const newId = event.target.id
        // const newClass = event.target.classList
        // const newValue = event.target.textContent.trim()
        // debuggerId.textContent= "id : " +  newId === "debuggerValue" ?  "":newId
        // debuggerClass.textContent="class : " + newClass
        // debuggerValue.textContent="Value : " + newValue
    });

    document.addEventListener('click', function (event) {        
        if(event.target.id==='saveUrlButton'){
            // alert(tabUrl)
            addurl(tabUrl)
        }else if(event.target.classList.contains('urlLi')){
            var newURL = event.target.textContent.trim();
            chrome.tabs.create({ url: newURL });
        }
    });


    
    // Update the displayed todo list
    function updateTodoList(urls) {
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';

        urls.forEach(url => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" class="checkbox" data-id="${url.id}"
                ${url.completed ? 'checked' : ''}>
                <span class="urlLi${url.completed ? ' completed' : ''}">
                ${url.text}</span>`;
            todoList.appendChild(listItem);
            
            // <span class=urlLi>
            // <span class= urlLi "${url.completed ? ' completed' : ''}">
        });
    }
});

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//form submission event 
var formSubmitHandler = function(event) {
    //stop brower from performing the default action
    event.preventDefault();

    //get value from input element 
    var username = nameInputEl.value.trim();

    if (username){
        getUserRepos(username);
        
        // clear old content
        repoContainerEl.textContent = '';
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var getUserRepos = function(user) {
    //format the gibut api url 
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url 
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user); 
                });    
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
             // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });

   
};

var displayRepos = function (repos, searchTerm) {
    //clear old content 
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //check if api returned any repos
    if(repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //loop over repos 
    for (var i = 0; i < repos.length; i++){
        //format repo name 
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for reach repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create a span element to hold respository name 
        var titleEl = document.createElement("span");
        titleEl.textContent= repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element 
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not 
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = 
            "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container 
        repoEl.appendChild(statusEl);

        //append container to DOM
        repoContainerEl.appendChild(repoEl);
    }
}


//event listener 
userFormEl.addEventListener("submit", formSubmitHandler);


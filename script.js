const getBtn = document.querySelector("#get-data-btn");
const showIpDiv = document.querySelector("#ip-div");
const video = document.querySelector(".bg-video");
const clickBtn = document.querySelector("#get-data-btn");
const ipAddress = document.querySelector(".ip-add");
const allDataContainer = document.querySelector(".main-container");

// this is for fetching ip address..
const showIP = document.querySelectorAll(".ip-span")[0]; // home window
const showIP1 = document.querySelectorAll(".ip-span")[1]; // all info window
fetch("https://api.ipify.org/?format=json")
  .then((res) => res.json())
  .then((res) => {
    showIP.innerHTML = res.ip;
    showIP1.innerHTML = res.ip;
    localStorage.setItem("ip", res.ip);
});

// this is for fetching location, timezone, hostname, organization, and other details...
let myIpAdd = localStorage.getItem("ip");
const myIpToken = "c68f2cc8a3e016";
let apiToken = "ipinfo.io/103.184.170.255?token=c68f2cc8a3e016";

const endPoint = `https://ipinfo.io/${myIpAdd}/geo?token=${myIpToken}`;
// async function to fetch data..
async function allData() {
  let response = await fetch(endPoint);
  let data = await response.json();
  localStorage.setItem("loc", data.loc);
  showData(data);
  allPostOfficeData(data);
  console.log(data);
}

// fetching map according to coordinates...
const iFrameBox = document.querySelector("#map-box");
function getMap() {
  let loc = localStorage.getItem("loc"); // getting coordinates in one string so need to split..
  let lati = loc.split(",")[0]; // latitude coordinates.
  let long = loc.split(",")[1]; // longtitude coordinates..
  iFrameBox.src = `https://maps.google.com/maps?q=${lati},${long}&output=embed`;
//   console.log(leti, long);
}


// This function will show the all required information on window
function showData(data){
    localStorage.setItem("postal", data.postal);
    let loc = localStorage.getItem("loc"); // getting coordinates in one string so need to split..
    let lati = loc.split(",")[0]; // latitude coordinates.
    let long = loc.split(",")[1]; // longtitude coordinates..
    let city = data.city;
    let region = data.region;
    let organization = data.org;
    let hostName = data.hostname;
    let timeZone = data.timezone;
    let pincode = data.postal;
    let currDateTime = new Date().toLocaleString("en-US", {timeZone: timeZone}); // convert timezone to time and date
    // console.log(lati, long, city, region, organization, hostName, timeZone, pincode, currDateTime);

    const locationInfo = document.querySelector(".location-info"); // location-info div..
    const moreInfo = document.querySelector(".some-info"); // after map info div..

    locationInfo.innerHTML = `
       <div class="lat-lon-info">
          <p id="latitude-info">Lat:  <span id="lat">${lati}</span></p>
          <p id="longitude-info">Lon:  <span id="lon">${long}</span></p>
        </div>
        <div class="city-region-info">
          <p id="city-inof">City:  <span id="city">${city}</span></p>
          <p id="region-info">Region:  <span id="region">${region}</span></p>
        </div>
        <div class="org-host-info">
          <p id="org-info">Organization: <span id="organization">${organization}</span></p>
          <div>
            <p id="host-info">Hostname:<p>
            <span id="hostname">${hostName}</span>
          </div>
        </div> 
    `;
    moreInfo.innerHTML = `
        <p id="timezone">Time Zone:  <span id="time-zone">${timeZone}</span></p>
        <p id="date-time">Date and Time:  <span id="date-time">${currDateTime}</span></p>
        <p id="pincode">Pincode:  <span id="pin-code">${pincode}</span></p>
    `;
}


// Frome we are working on finding post offices in that retrieved pincode.

const message = document.querySelector("#msg-span");
const postOfficeInfo = document.querySelector(".only-cards-container");

async function allPostOfficeData(data){
    let pincode = data.postal;
    let poApi = `https://api.postalpincode.in/pincode/${pincode}`
    let response = await fetch(poApi);
    let poArray = await response.json();
    // console.log(poArray);
    let msg = poArray[0].Message;
    message.innerHTML = msg;
    let postOffices = poArray[0].PostOffice;
    // console.log(postOffices);
    for(let i=0; i<postOffices.length; i++){
        let name = postOffices[i].Name;
        let branch = postOffices[i].BranchType;
        let dStatus = postOffices[i].DeliveryStatus;
        let district = postOffices[i].District;
        let division = postOffices[i].Division;
        // console.log(name, branch, dStatus, district, division);
        const postOfficeCard = document.createElement('div');
        postOfficeCard.className = 'postoffice-info-cards'

        postOfficeCard.innerHTML = `
            <div class="postoffice-name">
                <p>Name :</p>
                <p id="name-text">${name}</p>
            </div>
            <div class="postoffice-branchType">
                <p>Branch Type :</p>
                <p id="branch-text">${branch}</p>
            </div>
            <div class="postoffice-dStatus">
                <p>Delivery Status :</p>
                <p>${dStatus}</p>
            </div>
            <div class="postoffice-district">
                <p>District :</p>
                <p>${district}</p>
            </div>
            <div class="postoffice-division">
                <p>Division :</p>
                <p>${division}</p>
            </div>
        `;
        postOfficeInfo.append(postOfficeCard);
    }
}



// working on search input filter here...
const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('keyup', searchProduct);

function searchProduct(){
    let searchValue = searchInput.value.toUpperCase();
    let items = postOfficeInfo.querySelectorAll('.postoffice-info-cards');
    for(let i=0; i<items.length; i++){
        let name = items[i].querySelector('#name-text');
        let branch = items[i].querySelector('#branch-text')
        if((name.innerHTML.toUpperCase().indexOf(searchValue) > -1) || (branch.innerHTML.toUpperCase().indexOf(searchValue) > -1)){
            items[i].style.display = "initial";
        }
        else{
            items[i].style.display = "none";
        }
    }
    // console.log(searchValue);
}





// Onclick event function for 'click here' home-page button..
function getData() {
  showIpDiv.classList.add("active");
  video.classList.add("active");
  clickBtn.classList.add("active");
  ipAddress.classList.add("active");
  allDataContainer.classList.remove("active");
  allData();
  getMap();
}

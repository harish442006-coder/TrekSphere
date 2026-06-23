const search_text=document.querySelector('#search-text');
const search_btn=document.querySelector('#search-btn');
const parent=document.querySelector('.content-box');
const suggestion_list=document.querySelector('.search-suggestion');
const defaultContent=parent.innerHTML;

async function search(){
    suggestion_list.innerHTML='';
    parent.innerHTML='<h1>Search Result</h1>';
    const searchData=search_text.value.trim();
    search_btn.disabled=true;
    console.log(searchData);
    const data= await fetchData();
    if(searchData.toLowerCase()==='beaches' || searchData.toLowerCase()==='beach'){
        displayData(data.beaches);
    }
    else if(searchData.toLowerCase()==='countries' || searchData.toLowerCase()==='country'){
        displayData(data.countries);
    }
    else if(searchData.toLowerCase()==='temples' || searchData.toLowerCase()==='temple'){
        displayData(data.temples);
    }
    else if(searchData.toLowerCase()==='monuments' || searchData.toLowerCase()==='monument'){
        displayData(data.monuments);
    }
    else{
        matchData(searchData,data);
    }
    search_btn.disabled=false;
    
}

async function fetchData(){
    try{
        const data=await fetch("trekSphere.json")
        .then(response=>response.json());
        console.log(data);
        return data;
    }
    catch(error){
        console.log(error);
    }
}

function displayData(arr){
    let parentDiv=document.createElement('div');
    parentDiv.innerHTML='';
    parentDiv.classList='cards-container';

    if(arr.length===0){
        parentDiv.textContent="No Data Found";
        parentDiv.style.cssText="color:white; font-size:2rem";
        parent.appendChild(parentDiv);
        alert("No data found! we will add soon");
        return;
    }
    for(element of arr){
        let div=document.createElement('div');
        div.classList="card";
        div.innerHTML=`
            <img src="${element.imgsrc}" loading="lazy">
            <h2>${element.name}</h2>
            <p>${element.description}</p>
        `
        parentDiv.appendChild(div);
    }
    parent.appendChild(parentDiv);
}

function matchData(text,data){
    if(text===''){
        alert("Invalid search try using some keywords");
        return;
    }
    const elementArr=[];
    Object.values(data).forEach(arr =>{
        const newarr=arr.filter((element)=>{
            return element.name.toLowerCase().includes(text.toLowerCase());
        });
        elementArr.push(...newarr);
    })
    displayData(elementArr);
}


let delayedFetcher;

search_text.addEventListener('input',(e)=>{
    const query=e.target.value.trim();
    console.log(query);

    clearTimeout(delayedFetcher);

    if(query.length===0){
        suggestion_list.innerHTML='';
        return;
    }

    delayedFetcher=setTimeout(()=>{
        fetchSuggestions(query);
    },300);

    async function fetchSuggestions(input){
        const data=await fetchData();
        const elementArr=[];
        Object.values(data).forEach(arr =>{
            const newarr=arr.filter((element)=>{
                return element.name.toLowerCase().includes(query.toLowerCase());
            });
            elementArr.push(...newarr);
        });
        displaySuggestion(elementArr);
    }

    function displaySuggestion(arr){
        suggestion_list.innerHTML='';
        const topFive=arr.slice(0,5);
        if(topFive.length===0){
            suggestion_list.innerHTML="<li>No result found</li>";
            return;
        }
        topFive.forEach(item=>{
            const li=document.createElement('li');
            li.textContent=item.name;
            li.onclick=()=>{
                search_text.value=item.name;
                suggestion_list.innerHTML='';
            };

            suggestion_list.appendChild(li);
        });
    };
});

function clearSearch(){
    search_text.value='';
    suggestion_list.innerHTML='';
    parent.innerHTML=defaultContent;
    search_text.focus();
}

const hamburger = document.querySelector('.hamburger');
const navBar = document.querySelector('.nav-bar');

if (hamburger && navBar) {
    hamburger.addEventListener('click', () => {
        navBar.classList.toggle('active');
    });
}

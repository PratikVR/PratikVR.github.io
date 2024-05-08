let form = document.querySelector('.form')
let addBtn = document.querySelector('.add')
let algo = document.querySelector('#algo')
let animationPane = document.querySelector('.animationPane')
let animateBtn = document.querySelector('.animateBtns')
let processes = [];

//adding element into the dom and into the list
addBtn.addEventListener('click',(event)=>{
    console.log(' addButton clicked!!')
    event.preventDefault();
    let processID = document.querySelector('#processID').value
    let arrivalTime = parseInt(document.querySelector('#arrivalTime').value)
    let burstTime = parseInt(document.querySelector('#burstTime').value)
    if(processes.find(id => id.ID ==processID)){
        window.alert("Do not enter same id!")
        document.querySelector('#processID').value='';
        document.querySelector('#processID').focus();
        return;
    }
    if( !(processID && arrivalTime>=0 && burstTime>=0) ){
        return;
    }
    let p = new Process(processID,arrivalTime,burstTime,0,0,0)
    processes.push(p)
    //add to kardiya leikn screen pe? wo kaise?
    animationPane.append(p.element(false))
    form.reset()
})

//sarting the animations 
animateBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    if(processes.length>0){
        switch(algo.value){
            case 'FCFS' : 
                console.log("FCFS selected")
                FCFS()
                animateBtn.disabled = true;
                break;
            case 'SJF' : 
                console.log("SJF selected")
                SJF()
                animateBtn.disabled = true;
                break;
            default:
                window.alert("Select the scheduling algorithm !")
        }
    }else{
        window.alert("Add Processes first !")
    }

})
//function to clear processed processes from DOM
function clearProcesses(){
    processes.forEach(process=>
        {
            let selectElement = document.querySelector(`.p${process.ID}`)
            selectElement.remove()
        }
    )
}

// function to add processed processes to the DOM 
function addProcesses(arr){
    arr.forEach(process=>
        {
            let p = process.element(true)
            animationPane.append(p)
        }
    )


    let addNewBtn = document.createElement('button')
    addNewBtn.classList.add('Reset')
    addNewBtn.innerHTML = 'Reset'
    animationPane.append(addNewBtn)
    addNewBtn.addEventListener('click',(event)=>{
        clearProcesses()
        document.querySelector('.results').remove()
        processes = []
        animateBtn.disabled = false
        event.target.remove()
    })
}

class Process{
    constructor(ID,AT,BT,CT,WT,TAT){
        this.ID = ID;
        this.AT = AT;
        this.BT = BT;
        this.CT = CT;
        this.WT = WT;
        this.TAT =TAT;
    }
    element(value=false){
        let p = document.createElement('div');
        p.classList.add(`p${this.ID}`)
        
        p.innerHTML=
            `
            ID : ${this.ID} <br/>
            AT : ${this.AT} <br/>
            BT : ${this.BT} <br/>
            `
        if(value){
            p.innerHTML+=
                `
                CT : ${this.CT} <br/>
                TAT : ${this.TAT} <br/>
                WT : ${this.WT} <br/>
                `   
            }
        return p
    }
    animate(){
        let selectElement = document.querySelector(`.p${this.ID}`)
        selectElement.classList.add('flyin')
        selectElement.addEventListener('animationend',(event)=>{
                selectElement.classList.remove('flyin') 
                // selectElement.innerHTML = ''         
                selectElement.classList.add('processing')
        })
      }
}

function FCFS() {
    //sorting logic for FCFS algorithm:
    sortingLogic = (a,b)=>{
        if(a.AT==b.AT){
            // if the arrival time is same for both : sort with respect to BT
            return a.BT - b.BT 
        }else{
            // to sort process with respect to AT
            return a.AT - b.AT  
        }
    }
    //sorting processes array :
    processes.sort((a,b)=> sortingLogic(a,b))

    // initially setting values of variables for the first process ie., process with smallest AT
    processes[0].animate();
    processes[0].TAT = processes[0].BT
    processes[0].CT = processes[0].AT + processes[0].BT
    processes[0].WT = 0
    let currentTime = processes[0].CT
    let totalTAT = processes[0].TAT
    let totalWT = 0
    let avgTAT = 0
    let avgWT = 0
    //function to display results
    displayResults =()=> {
        let result  =  document.createElement('div')
        result.classList.add('results')
        result.innerHTML= `
        <br/>
        <br/>
        Avg TAT = ${avgTAT.toFixed(4)} <br/>
        Avg WT = ${avgWT.toFixed(4)} <br/>
        <br/>
        <br/>` 
        animationPane.append(result)
    }
    // function for setting times for other processes
    initTime = (i)=>{
        if(currentTime <processes[i].AT){
            currentTime = processes[i].AT    
        }
        processes[i].CT = currentTime+processes[i].BT
        processes[i].TAT = processes[i].CT - processes[i].AT
        processes[i].WT = processes[i].TAT - processes[i].BT
        currentTime += processes[i].BT
        totalWT += processes[i].WT
        totalTAT +=processes[i].TAT
    }

    let i = 1  // Start with 1 to animate the second process immediately
    
    let iter = setInterval(() => {
        if (i === processes.length) {
            clearInterval(iter)
            avgTAT = totalTAT/processes.length
            avgWT  = totalWT/processes.length
            clearProcesses()
            addProcesses(processes)
            displayResults()        
            form.reset()
        }else{
            processes[i].animate()
            initTime(i)
            i++
        }
    }, 5000)
}

function SJF() {
    // Sorting logic for SJF algorithm:
    sortingLogic = (a, b) => {
        if (a.AT === b.AT) {
            // If arrival time is the same, sort by burst time
            return a.BT - b.BT;
        } else {
            // Sort by arrival time
            return a.AT - b.AT;
        }
    };

    // Sorting processes array initially w/r to AT:
    processes.sort((a,b)=>{
        if(a.AT==b.AT){
            // if the arrival time is same for both : sort with respect to BT
            return a.BT - b.BT 
        }else{
            // to sort process with respect to AT
            return a.AT - b.AT  
        }
    });

    // Function to calculate completion time, turnaround time, and waiting time for each process
    for (let i = 0; i < processes.length; i++) {
        processes[i].CT = 0;
        processes[i].TAT = 0;
        processes[i].WT = 0;
    }

    let currentTime = processes[0].AT; // Initialize current time with the arrival time of the first process
    let totalTAT = 0;
    let totalWT = 0;
    let avgTAT = 0;
    let avgWT = 0;
    let i = 0;
    let completed = []
    let noOfProcess = processes.length;
    let delay = 5000
    // Initialize the first arrived process
    processes[i].animate()
    processes[i].CT = currentTime + processes[i].BT;
    processes[i].TAT = processes[i].CT - processes[i].AT;
    processes[i].WT = processes[i].TAT - processes[i].BT;
    totalTAT += processes[i].TAT;
    totalWT += processes[i].WT;
    currentTime = processes[i].CT;
    completed.push(processes[0]);
    processes.splice(0, 1);
    i++;
    // now from this moment onwards i need to sort the processes according to th bust time 
    processes.sort((a,b)=>sortingLogic(a,b))
    let iter = setInterval(() => {
        if (processes.length==0) {
            clearInterval(iter);
            avgTAT = totalTAT / noOfProcess;
            avgWT = totalWT / noOfProcess;
            clearProcesses();
            addProcesses(completed);
            displayResults();
            form.reset();
        } else {
            // Filter processes that have arrived by the current time
            let arrivedProcesses = processes.filter(process => process.AT <= currentTime);

            // Sort arrived processes by burst time
            arrivedProcesses.sort((a, b) => a.BT - b.BT);

            if (arrivedProcesses.length > 0) {
                let selectedProcess = arrivedProcesses[0];
                selectedProcess.animate();
                if(currentTime <selectedProcess.AT){
                    currentTime = selectedProcess.AT    
                }
                selectedProcess.CT = currentTime + selectedProcess.BT;
                selectedProcess.TAT = selectedProcess.CT - selectedProcess.AT;
                selectedProcess.WT = selectedProcess.TAT - selectedProcess.BT;

                totalTAT += selectedProcess.TAT;
                totalWT += selectedProcess.WT;
                currentTime += selectedProcess.BT;
                completed.push(selectedProcess);
               processes.splice(processes.indexOf(selectedProcess), 1);
               // Remove the processed process from the list
               delay = 5000 
            } else {

                currentTime +=1 
                // If no process has arrived, move to the next time unit
                delay =0;
            }

            i++;
        }
    }, delay);

    // Function to display results
    displayResults = () => {
        let result = document.createElement('div');
        result.classList.add('results');
        result.innerHTML = `
            <br/>
            <br/>
            Avg TAT = ${avgTAT.toFixed(4)} <br/>
            Avg WT = ${avgWT.toFixed(4)} <br/>
            <br/>
            <br/>`;
        animationPane.append(result);
    };
}
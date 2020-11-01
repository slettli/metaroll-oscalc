/*
  __  __ _____ _____  _    ____   ___  _     _       _   _ _____ _____ 
 |  \/  | ____|_   _|/ \  |  _ \ / _ \| |   | |     | \ | | ____|_   _|
 | |\/| |  _|   | | / _ \ | |_) | | | | |   | |     |  \| |  _|   | |  
 | |  | | |___  | |/ ___ \|  _ <| |_| | |___| |___ _| |\  | |___  | |  
 |_|  |_|_____| |_/_/   \_\_| \_\\___/|_____|_____(_)_| \_|_____| |_|  
                                                                       
*/
let accessArray = []; // Array holding all of the AccessObjects of hacked users / admins
let OSMAX = 40; // Max OS score before GOD smites you
let OS = 0; // The decker's OS score
let ROUNDS = 0; // Number of rounds hacking
let PROGRAMS = 0; // Number of illegal programs used per actions
let HITS = 0; // Total opposed hits on illegal actions
let UNTILGOD = "???"; // Rounds left until GOD smites thee
let NUMADMINS = 0; // Number of active admins
let NUMUSERS = 0; // Number of active users
let CONFIRMONE = false; // Whether confirm button one has been pressed
let CONFIRMTWO = false;

// Load previous state (if any) and render
window.onload = (event) => {
    StorageHandler.get();
    RenderHandler.update();
};

// Runs each round and does necessary calculations
const RoundCalculator = (() => {
    const _newRound = () => {
        _calculateOS();
        _calcRounds();
        _updateRounds();
        ROUNDS++;
    };
    // Calculate OS score in regards to active users and admins
    const _calculateOS = () => {
        let adminOS = NUMADMINS;
        adminOS = adminOS * 3;
        let userOS = NUMUSERS;
        OS = OS + adminOS + userOS; // Add to OS
    };
    // Calculates remaining rounds until GOD smithes thee
    const _calcRounds = () => {
        let adminOS = NUMADMINS;
        adminOS = adminOS * 3;
        let userOS = NUMUSERS;

        let remainingOS = 40 - OS;
        let accessOsPerRound = adminOS + userOS;
        
        if (accessOsPerRound > 0){
            UNTILGOD = remainingOS / accessOsPerRound;
            UNTILGOD = Math.ceil(UNTILGOD);
        }
        else {
            UNTILGOD = "???";
        }
    }
    // Increment round counter for each access object
    const _updateRounds = () => {
        if (accessArray.length > 0){
            for (let i = 0; i < accessArray.length; i++){
                if (accessArray[i].getActive()){
                    accessArray[i].addRound();
                }
            }
        }
    };

    const newRound = () => {
        _newRound();
    };

    const calcRounds = () => {
        _calcRounds();
    }

    return {
        newRound,
        calcRounds
    }
})();

// Factory that creates AdminObjects
const AccessObject = (name, notes) => {
    let _activeRounds = 1; // How many sustained rounds has the decker sustained admin?
    let _active = true; // Is the decker currently accessing this host?
    let _access = "user"; // Level of access

    const addRound = () => _activeRounds++;
    const setRounds = (rounds) => _activeRounds = rounds;
    const toggleActive = () => _active == true ? _active = false : _active = true;
    const toggleAccess = () => _access == "user" ? _access = "admin" : _access = "user";
    const getRounds = () => _activeRounds;
    const getActive = () => _active;
    const getName = () => name;
    const getNotes = () => notes;
    const getAccess = () => _access;

    return {
        addRound,
        setRounds,
        toggleActive,
        toggleAccess,
        getRounds,
        getName,
        getActive,
        getNotes,
        getAccess
    }
};

// Reads input from New Access form and creates new access accordingly
const NewAccess = (() => {
    const _readForm = (type) => {
        let name = document.getElementById("accessName").value;
        let notes = document.getElementById("accessNote").value;
        if (type == "newAdmin"){
            _newAdmin(name,notes);
        }
        else {
            _newUser(name,notes);
        }
    };

    const _newAdmin = (name, notes) => {
        let newAdmin = AccessObject(name, notes);
        newAdmin.toggleAccess()
        accessArray.push(newAdmin);
        NUMADMINS++;
    };

    const _newUser = (name, notes) => {
        let newUser = AccessObject(name, notes);
        accessArray.push(newUser);
        NUMUSERS++;
    };
    // Used to rebuild new access objects using info from LocalStorage.
    const _rebuildAccessList = (rounds, active, access, name, notes) => {
        let newAccess = AccessObject(name, notes);
        newAccess.setRounds(rounds);
        if (active == false){
            newAccess.toggleActive();
        }
        if (access == "admin"){
            newAccess.toggleAccess();
        }
        accessArray.push(newAccess);
    }

    const add = (type) => {
        _readForm(type);
    };

    const rebuild = (rounds, active, access, name, notes) => {
        _rebuildAccessList(rounds, active, access, name, notes);
    };

    return { 
        add,
        rebuild
    }
})();

// Small things that change the OS 
const UpdateOS = (() => {
    // OS increases by 1 for each matrix action modified by a hacking program
    // OS increases by 1 per hit on opposing roll
    const _addOS = (type) => {
        if (type == "program"){
            PROGRAMS++;
        }
        else if (type == "hits"){
            HITS++;
        }
        OS++;
    };
    // Manually decrease OS
    const _decOS = (type) => {
        if (type == "program"){
            PROGRAMS--;
        }
        else if (type == "hits"){
            HITS--;
        }
        OS--;
    };

    const increaseOS = (type) => {
        _addOS(type);
    };

    const decreaseOS = (type) => {
        _decOS(type);
    };

    return { 
        increaseOS,
        decreaseOS,
     }
})();

// Restarts the tracker, resets every variable, custom classes and wipes LocalStorage.
const RebootCyberdeck = (() => {
    const _restartTracker = () => {
        accessArray = [];
        OSMAX = 40;
        OS = 0;
        ROUNDS = 0;
        PROGRAMS = 0;
        HITS = 0;
        UNTILGOD = "???";
        NUMADMINS = 0;
        NUMUSERS = 0;
        CONFIRMONE = false;
        CONFIRMTWO = false;
        let tmp = document.getElementById("confirmBtn1");
        tmp.classList.remove("fullyVisible");
        tmp = document.getElementById("confirmBtn2");
        tmp.classList.remove("fullyVisible");
        tmp = document.getElementById("stopBtn");
        tmp.classList.add("halfVisible");
        tmp.classList.add("hoverNo");
        tmp.classList.remove("animateFade");
        tmp.classList.remove("hoverYes");
        document.getElementById("osDiv").classList.remove("glitch");
        document.getElementById("roundsUntilGod").classList.remove("glitch");
        document.getElementById("confirmBtn2").classList.remove("halfVisible");
        document.getElementById("confirmBtn1").classList.remove("halfVisible");   
        document.getElementById("confirmBtn2").classList.add("fullyVisible");   
        document.getElementById("confirmBtn1").classList.add("fullyVisible");
        StorageHandler.wipe();
    };

    const reboot = () => {
        _restartTracker();
    };

    return { reboot }
})();

// Takes input from buttons and acts accordingly
const InputHandler = (() => {
    // Takes command inputs as strings from buttons on page
    const _handleCommand = (command) => {
        switch(command){
            case "increasePrograms":
                UpdateOS.increaseOS("program");
                RoundCalculator.calcRounds();
                break;
            case "decreasePrograms":
                UpdateOS.decreaseOS("program");
                RoundCalculator.calcRounds();
                break;
            case "increaseHits":
                UpdateOS.increaseOS("hits");
                RoundCalculator.calcRounds();
                break;
            case "decreaseHits":
                UpdateOS.decreaseOS("hits");
                RoundCalculator.calcRounds();
                break;
            case "newRound":
                RoundCalculator.newRound();
                break;
            case "newUser":
                NewAccess.add("newUser");
                RoundCalculator.calcRounds();
                break;
            case "newAdmin":
                NewAccess.add("newAdmin");
                RoundCalculator.calcRounds();
                break;
            case "confirmOne":
                if (CONFIRMONE == false){
                    CONFIRMONE = true;
                    document.getElementById("confirmBtn1").classList.remove("fullyVisible");   
                    document.getElementById("confirmBtn1").classList.add("halfVisible");
                }
                else {
                    CONFIRMONE = false;
                    document.getElementById("confirmBtn1").classList.remove("halfVisible");
                    document.getElementById("confirmBtn1").classList.add("fullyVisible");   
                }
                break;
            case "confirmTwo":
                if (CONFIRMTWO == false){
                    CONFIRMTWO = true;
                    document.getElementById("confirmBtn2").classList.remove("fullyVisible");   
                    document.getElementById("confirmBtn2").classList.add("halfVisible");
                }
                else {
                    CONFIRMTWO = false;
                    document.getElementById("confirmBtn2").classList.remove("halfVisible");
                    document.getElementById("confirmBtn2").classList.add("fullyVisible");   
                }
                break;
            case "rebootCyberdeck":
                if (CONFIRMONE == true && CONFIRMTWO == true){
                    RebootCyberdeck.reboot();
                }
                break;
        }
        // Make 'Reboot Cyberdeck' button appear accessible
        if (CONFIRMONE == true && CONFIRMTWO == true){
            let tmp = document.getElementById("stopBtn");
            tmp.classList.remove("halfVisible");
            tmp.classList.remove("hoverNo");
            tmp.classList.add("animateFade");
            tmp.classList.add("hoverYes");
        }
        // Reset 'Reboot Cyberdeck' button in case user changes his mind
        else {
            let tmp = document.getElementById("stopBtn");
            tmp.classList.remove("animateFade");
            tmp.classList.remove("hoverYes");
            tmp.classList.add("halfVisible");
            tmp.classList.add("hoverNo");
        }
        // Make the OS score look glitchy when you're approaching OSMAX
        if (OS >= 30 || UNTILGOD == 1){
            document.getElementById("osDiv").classList.add("glitch");
            document.getElementById("roundsUntilGod").classList.add("glitch");
        }
        StorageHandler.save();
        RenderHandler.update();
    };
    // Set active state to false for access object, decrease number of according access
    const _exitHost = (id) => {
        accessArray[id].toggleActive();
        if (accessArray[id].getAccess() === "admin"){
            NUMADMINS--;
        }
        else {
            NUMUSERS--;
        }
        RoundCalculator.calcRounds();
        StorageHandler.save();
        RenderHandler.update();
    }

    const exit = (id) => {
        _exitHost(id);
    };

    const command = (command) => {
        _handleCommand(command);
    };

    return {
        command,
        exit
    }
})();

// Handles HTML and DOM manipulation
const RenderHandler = (() => {
    // Updates the info in HTML
    const _updateHTML = () => {
        document.getElementById("osDiv").title = OS;
        document.getElementById("osDiv").innerHTML = OS;
        if (OS >= 40) {
            document.getElementById("roundsUntilGod").innerHTML = `- R I P -`;
            document.getElementById("roundsUntilGod").title = `- R I P -`;
        }
        else if (UNTILGOD == 1){
            document.getElementById("roundsUntilGod").innerHTML = `- GOD IS COMING -`;
            document.getElementById("roundsUntilGod").title = `- GOD IS COMING -`;
        }
        else {
            document.getElementById("roundsUntilGod").innerHTML = `Until GOD: ${UNTILGOD}`;
            document.getElementById("roundsUntilGod").title = `Until GOD: ${UNTILGOD}`;
        }
        document.getElementById("roundsCounter").innerHTML = `Round: ${ROUNDS}`;
        document.getElementById("numPrograms").innerHTML = PROGRAMS;
        document.getElementById("numHits").innerHTML = HITS;
        document.getElementById("activeAdmins").innerHTML = `Active admins: ${NUMADMINS}`;
        document.getElementById("activeUsers").innerHTML =`Active users: ${NUMUSERS}`;
        _clearDOM();
        _loopAccess();
    };
    // Loop the list of hosts currently being hacked into
    const _loopAccess = () => {
        for (let i = 0; i < accessArray.length; i++){
            if (accessArray[i].getActive() === true){
                let name = accessArray[i].getName();
                let notes = accessArray[i].getNotes();
                let access = accessArray[i].getAccess();
                let rounds = accessArray[i].getRounds();
     
                _renderAccess(name,notes,access,rounds, i);
            }
        }
    };
    // Render the list of hosts currently being hacked into
    const _renderAccess = (name, notes, access, rounds, index) => {
        let accessDiv = document.createElement("div");
        accessDiv.setAttribute("id", access + index);
        accessDiv.setAttribute("class", "access");

        let accessType = document.createElement("p");
        accessType.innerHTML = `Access: ${access}`;

        let accessName = document.createElement("p");
        accessName.innerHTML = `Name: ${name}`;

        let accessRounds = document.createElement("p");
        accessRounds.innerHTML = `Rounds: ${rounds}`;

        let accessNotes = document.createElement("p");
        accessNotes.innerHTML = notes;

        let button = document.createElement("button");
        button.setAttribute("id", index);
        button.setAttribute("class", 'removeAccessButton');
        button.setAttribute('value', index);
        button.textContent = "EXIT HOST";
        button.setAttribute("onclick", "InputHandler.exit(this.id)");

        accessDiv.appendChild(accessName);
        accessDiv.appendChild(accessType);
        accessDiv.appendChild(accessRounds);
        accessDiv.appendChild(accessNotes);
        accessDiv.appendChild(button);

        document.getElementById("accessList").appendChild(accessDiv);
    };
    // Clear the list of hosts before rendering new ones
    const _clearDOM = () => {
        let accessDiv = document.getElementsByClassName("access");
        while (accessDiv.length > 0){
            accessDiv[0].parentNode.removeChild(accessDiv[0]);
        }
        let name = document.getElementById("accessName");
        let notes = document.getElementById("accessNote");
        name.value = "";
        notes.value = "";
    };

    const update = () => {
        _updateHTML();
    }

    return {
        update
    }
})();

// Handles data storage to localstorage
const StorageHandler = (() => {
    // Get all stored values from localstorage (if any), parse string to integer where needed
    const _getLocalStorage = () => {
        if(localStorage.getItem('accessArray') != null) {
            _accessArrayRebuilder();
        }
        if(localStorage.getItem('OSMAX') != null) {
            OSMAX = parseInt(localStorage.getItem('OSMAX'));
        }
        if(localStorage.getItem('OS') != null) {
            OS = parseInt(localStorage.getItem('OS'));
        }
        if(localStorage.getItem('ROUNDS') != null) {
            ROUNDS = parseInt(localStorage.getItem('ROUNDS'));
        }
        if(localStorage.getItem('PROGRAMS') != null) {
            PROGRAMS = parseInt(localStorage.getItem('PROGRAMS'));
        }
        if(localStorage.getItem('HITS') != null) {
            HITS = parseInt(localStorage.getItem('HITS'));
        }
        if((localStorage.getItem('UNTILGOD') != null) && (localStorage.getItem('UNTILGOD') != "???")) {
            UNTILGOD = parseInt(localStorage.getItem('UNTILGOD'));
        }
        if(localStorage.getItem('NUMADMINS') != null) {
            NUMADMINS = parseInt(localStorage.getItem('NUMADMINS'));
        }
        if(localStorage.getItem('NUMUSERS') != null) {
            NUMUSERS = parseInt(localStorage.getItem('NUMUSERS'));
        }
        if (OS >= 30 || UNTILGOD == 1){
            document.getElementById("osDiv").classList.add("glitch");
            document.getElementById("roundsUntilGod").classList.add("glitch");
        }
    };
    // LocalStorage only takes strings, so we parse info about the AccessObjects into objects and then into json
    const _accessArraySaver = () => {
        let storageArray = [];
        for (let i = 0; i < accessArray.length; i++){
            let rounds = accessArray[i].getRounds();
            let active = accessArray[i].getActive();
            let access = accessArray[i].getAccess();
            let name = accessArray[i].getName();
            let notes = accessArray[i].getNotes();
            
            let accessObject = {rounds, active, access, name, notes};
            storageArray.push(accessObject);
        }
        localStorage.setItem('accessArray', JSON.stringify(storageArray));
    };
    // The list of hosts/access had to be stored as objects in an array, so all AccessObjects must be rebuilt on load
    const _accessArrayRebuilder = () => {
        let tmpArr = JSON.parse(localStorage.getItem('accessArray') || "[]");
        for (let i = 0; i < tmpArr.length; i++){
            let rounds = parseInt(tmpArr[i].rounds);
            let active = tmpArr[i].active;
            let access = tmpArr[i].access;
            let name = tmpArr[i].name;
            let notes = tmpArr[i].notes;

            NewAccess.rebuild(rounds, active, access, name, notes);
        }
    };
    // Add or update all normal variables
    const _updateLocalStorage = () => {
        localStorage.setItem('OSMAX', OSMAX);
        localStorage.setItem('OS', OS);
        localStorage.setItem('ROUNDS', ROUNDS);
        localStorage.setItem('PROGRAMS', PROGRAMS);
        localStorage.setItem('HITS', HITS);
        localStorage.setItem('UNTILGOD', UNTILGOD);
        localStorage.setItem('NUMADMINS', NUMADMINS);
        localStorage.setItem('NUMUSERS', NUMUSERS);
        _accessArraySaver();
    };

    const _wipeLocalStorage = () => {
        localStorage.clear();
    };

    const get = () => {
        _getLocalStorage();
    };

    const save = () => {
        _updateLocalStorage();
    };

    const wipe = () => {
        _wipeLocalStorage();
    };

    return {
        save,
        wipe,
        get
    }
})();
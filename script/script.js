    function displayTime(){
        function updateTime(){
            const now = new Date();

            const options = {timeZone: "America/Denver"};
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12:true };
            const formattedTime = now.toLocaleString('en-US', timeOptions);
            document.getElementById("time-display").textContent = formattedTime + ", MDT"
        }
        updateTime();
        setInterval(updateTime, 1000);
    }
    displayTime();

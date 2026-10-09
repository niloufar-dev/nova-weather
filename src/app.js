const temp = document.querySelector('.temp')
const conditiontext=document.querySelector('.condition-text')
const feelstemp=document.querySelector('.feels-temp')
const feeldate=document.querySelector('.date')
const sunrise=document.querySelector('.sunrize')
const sunset=document.querySelector('.sunset')
const windtext=document.querySelector('.wind')
const cloudtext=document.querySelector('.clouds')
const searchs=document.querySelector('.searchs')
const searchicon=document.querySelector('.search-icon')
const locationtext=document.querySelector('.location-text')
const conditionicon=document.querySelector('.condition-icon')
const hu= document.querySelector('.hu')
const win=document.querySelector('.win')
const visibility=document.querySelector('.visibility')
const presssuretext=document.querySelector('.presssure-text')
const hourlist=document.querySelectorAll('.hour-list>div')
const dayname=document.querySelectorAll('.day-name')
const dayicon=document.querySelectorAll('.day-icon')
const mintemp=document.querySelectorAll('.mintemp')
const maxtemp=document.querySelectorAll('.maxtemp')
const sunriseexposure=document.querySelector('.sunrise-exposure')
const sunsetexposure=document.querySelector('.sunset-exposure')
const sunposition=document.querySelector('.sun-position')
const citytemp=document.querySelectorAll('.city-temp')
const hourhand = document.querySelector('.hour-hand')
const minutehand = document.querySelector('.minute-hand')
const secondhand = document.querySelector('.second-hand')
const clockcity = document.querySelector('.clock-city')

getweather(
    35.69439,
    51.42151
)
futurehour([35.69439, 51.42151])
futurday([35.69439, 51.42151])

 async function searchcity(city) {
    try {
        let res=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    if(!res.ok){
        throw new Error("city dosnt exist");
        
    }
    let data=await res.json()
    console.log(data);
    
    // console.log(data.results[0].latitude);
    // console.log(data.results[0].longitude);
    let xy=[data.results[0].latitude , data.results[0].longitude]
    locationtext.textContent=data.results[0].name + ','+data.results[0].country
    clockcity.textContent=data.results[0].name + ','+data.results[0].country
    
    
    // console.log(xy);
    
    return xy
    
    } catch (err) {
        console.log(err);
        
    }

    
}


searchicon.addEventListener('click', async ()=>{
    let val = searchs.value.trim()

    let xy = await searchcity(val)
    console.log(xy);
    

    getweather(xy[0],xy[1])
    futurehour(xy)
    futurday(xy)
    

    console.log(xy);
    
})
// console.log(searchs);

async function getweather(latitude,longtitude) {
    try {
        let res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longtitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,pressure_msl,visibility&daily=sunrise,sunset&timezone=auto`)
        if(!res.ok){
            throw new Error('error');
        }

        let data= await res.json()
        let dama=Math.round(data.current.temperature_2m)
        let feels = Math.round(data.current.apparent_temperature)
        let Humidity=Math.round(data.current.relative_humidity_2m)
        let visibile = (data.current.visibility / 1000).toFixed(1)
        let pressure = data.current.pressure_msl
        console.log(Humidity);
        


        temp.innerText=dama +' '+'°C'
        feelstemp.textContent=feels +' '+'°C'
        feeldate.textContent=getdate()
        hu.textContent=Humidity+'%'
        visibility.textContent=visibile +' '+'Km'
        presssuretext.textContent=pressure+' '+'hPa'


        
        let weatherCode = data.current.weather_code;
        
        console.log(weatherCode);
        

        

    // console.log(data);
    // console.log(data.current);
    // console.log(data.current.weather_code);
    // console.log(data.daily);
    console.log(data.current.visibility);
    

    let sunr=data.daily.sunrise[0]
    let timesunr=sunr.split('T')[1]
    
    
    // console.log(timesunr);
    sunrise.textContent=timesunr+' '+ 'Am'
    sunriseexposure.textContent=timesunr+' '+ 'Am'

    ///////////////////////////

    let suns=data.daily.sunset[0]
    
    
    let timesuns=suns.split('T')[1]
    sunset.textContent=timesuns+' '+'Pm'
    sunsetexposure.textContent=timesuns+' '+'Pm'
    let p=(new Date(suns)- new Date(sunr))
    console.log(p);
    let hours = Math.floor(p / (1000 * 60 * 60))
    console.log(hours);
        
    let minutes = Math.floor((p % (1000 * 60 * 60)) / (1000 * 60))
    document.querySelector('.daylight-time').textContent=`${hours} h ${minutes} m`

    ///////////////////////////////////////////////////////////////////////
        let nowtime = new Date(data.current.time)
        // console.log(nowtime);
        
        let timepasssunr=(nowtime-new Date(sunr))
        console.log(timepasssunr);
        
        let hourpasspercent=(timepasssunr / p) * 100
        console.log(hourpasspercent);

        if (hourpasspercent < 0) {

            hourpasspercent = 0
        }

        if (hourpasspercent > 100) {

            hourpasspercent = 100
        }

        let sunleft = 9 + (hourpasspercent * 82 / 100)

        sunposition.style.left = sunleft + '%'

        let x = (hourpasspercent - 50) / 50

        let sunTop = 5 + (x * x * 85)

        
        sunposition.style.top = sunTop + 'px'

        //////////////////////////////
        let solarpeak = new Date(sunr)

        let hourspeak = solarpeak.getHours() + Math.floor(p / 2 / 3600000)

        let minutespeak = solarpeak.getMinutes()
        if(hourspeak<10){
            document.querySelector('.sun-now').textContent =
        `0${hourspeak}:${minutespeak}`
        }else if(minutespeak<10){
            
        document.querySelector('.sun-now').textContent =
        `${hourspeak}:0${minutespeak}`
        }else{
        document.querySelector('.sun-now').textContent =
        `${hourspeak}:${minutespeak}`
        }
        
    
    
    


    ////////////////////////////////////////////
    let currentTime =(data.current.time)
    console.log(currentTime);
    console.log(data.timezone);
    let datatime=data.timezone
    window.datatime=datatime
    
    
    

let night=currentTime<sunr || currentTime >suns
// console.log(currentTime);
    //////////////////////////////////////////////    
    let wind = data.current.wind_speed_10m

    windtext.textContent=wind+'Km/h'
    win.textContent=wind+' '+'Km/h'

    ///////////////////////////////////////////
    let clouds = data.current.cloud_cover
    cloudtext.textContent=clouds+'%'
    
    /////////////////////////
    weathercondition(weatherCode,conditionicon,night)
        conditiontext.textContent=b
    
    
    } catch (err) {
        console.log(err);
    }
    
    
}


async function futurehour(city) {
    try {
        let res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city[0]}&longitude=${city[1]}&hourly=temperature_2m,weather_code,precipitation_probability&forecast_hours=9&timezone=auto`)
        if (!res.ok) {
            throw new Error('esshhhtebah')
            
        }
        let data= await res.json()
        // console.log(data.hourly.time)
        
         weathercondition(data.hourly.weather_code[0] , hourlist[0].children[1])
         hourlist[0].children[2].textContent=(data.hourly.temperature_2m[0]).toFixed(0)+'°'
    ///////////////////////////////////////
// console.log(hourlist);

    for(let i = 1; i <= 9; i++){
        let current=data.hourly.time[i]
        // console.log(current);
        

    weathercondition(
        data.hourly.weather_code[i],
        hourlist[i].children[1]
    )

    hourlist[i].children[0].textContent =
        data.hourly.time[i].split('T')[1]

    hourlist[i].children[2].textContent =
        data.hourly.temperature_2m[i].toFixed(0) + '°'
}
        
    } catch (error) {
        
    }
    
}
///////////////////////////////////////////////////////

async function futurday(city) {

try {
        let res= await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city[0]}&longitude=${city[1]}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=7&timezone=auto`)
        if (!res.ok) {
            throw new Error('bro baba')
            
        }
        let data= await res.json()
        console.log(data.daily);
        
        
        for(let i=0 ; i<=6 ; i++){
        
            dayname[i].textContent=getday(data.daily.time[i])
            
            weathercondition(data.daily.weather_code[i],dayicon[i])

            mintemp[i].textContent=Math.round(data.daily.temperature_2m_min[i])+'°'
            maxtemp[i].textContent=Math.round(data.daily.temperature_2m_max[i])+'°'


            
        }
    
} catch (error) {
    
}
    // return data
    
    
    
}
// futurday()

// futurrday(xy)
function getday(date){
    let day=new Date(date)
    let newd=day.getDay()
    let weekday=days[newd]
    return weekday

}


let b
function weathercondition(x,ctex,night=false) {

    if(x == 0){
      b = night ? 'Clear Night' : 'Sunny'
    ctex.textContent = night ? '🌙' : '☀️'
    }

    if(x == 1){
         b = night ? 'Mainly Clear' : 'Mainly Sunny'
        ctex.textContent = night ? '🌙' : '🌤️'
    }

    if(x == 2){
         b = 'Partly Cloudy'
        ctex.textContent = night ? '☾☁️' : '⛅'
    }

    if(x == 3){
        b = 'Cloudy'
        ctex.textContent='☁️'
    }

    if(x >= 45 && x <= 48){
        b = 'Foggy'
        ctex.textContent='🌫️'
    }

    if(x >= 51 && x <= 57){
        b = 'Light Rain'
        ctex.textContent='🌦️'
    }

    if(x >= 61 && x <= 67){
        b = 'Rainy'
        ctex.textContent='🌧️'
    }

    if(x >= 71 && x <= 77){
        b = 'Snowy'
        ctex.textContent='❄️'
    }

    if(x >= 80 && x <= 82){
        b = 'Rain Showers'
        ctex.textContent='🌦️'
    }

    if(x >= 85 && x <= 86){
        b = 'Snow Showers'
        ctex.textContent='🌨️'
    }

    if(x >= 95 && x <= 99){
        b = 'Thunderstorm'
        ctex.textContent='⛈️'
    }
}

////////////////////////////////////////////////




let da
let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

function getdate(){

    da = new Date()

    let day = days[da.getDay()]
    let date = da.getDate()
    let month = months[da.getMonth()]

    // console.log(day, date, month)
    let total=day+' '+date+' '+month
    // console.log(total);
    return total

}

getdate()

/////////////////////////////////
const savedcities = [
    [51.5074, -0.1278],
    [35.69439, 51.42151],
    [35.6762, 139.6503],
    [40.7128, -74.0060]
]

async function savedcity() {

    const citytemp = document.querySelectorAll('.city-temp')

    for(let i = 0; i < savedcities.length; i++){

        let res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${savedcities[i][0]}&longitude=${savedcities[i][1]}&current=temperature_2m`
        )

        let data = await res.json()

        citytemp[i].textContent =
            Math.round(data.current.temperature_2m) + '°'
    }
}

savedcity()


//////////////////////////watch///////////////////


function watch(param) {
let time = new Intl.DateTimeFormat('en-GB', {
    timeZone: param,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
}).formatToParts()

    let h = Number(time.find(item => item.type === 'hour').value)
    let m = Number(time.find(item => item.type === 'minute').value)
    let s = Number(time.find(item => item.type === 'second').value)

    hourhand.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`
    minutehand.style.transform = `rotate(${m * 6 + s * 0.1}deg)`
    secondhand.style.transform = `rotate(${s * 6}deg)`
    

// return time
    
}

setInterval(()=>{
        watch(datatime)
    },1000)
/////////////////////////////////////////////

const searchresult=document.querySelector('.searchs')
const citysuggestions=document.querySelector('.city-suggestions')
let timer

searchresult.addEventListener('input',async()=>{
    clearTimeout(timer)
    let city = searchresult.value.trim()
      if (city === '') {
        citysuggestions.innerHTML = ''
        citysuggestions.classList.add('hidden')
        return
    }

    timer=setTimeout(async() => {
        
    let res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`
    )
    let data=await res.json()

    if (!data.results || data.results.length === 0) {
    return
}

citysuggestions.innerHTML = ''

    data.results.map((val)=>{
        let btn=document.createElement('button')
        btn.setAttribute('type','button')
        btn.className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-sky-50'
        btn.innerHTML=`  <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/>
        <circle cx="12" cy="9" r="2.3"/>
      </svg>
    </span>
    <span class="min-w-0 flex-1">
      <span class="block text-sm font-semibold">${val.name}</span>
      <span class="mt-1 block text-xs text-slate-500">${val.country}</span>
    </span>
    <span class="text-xs text-slate-400">${val.timezone}</span>`
    citysuggestions.appendChild(btn)

    btn.addEventListener('click',async()=>{
          searchresult.value = val.name

    citysuggestions.classList.add('hidden')
    citysuggestions.innerHTML = ''

    let xy = await searchcity(val.name)

    
        getweather(xy[0], xy[1])
        futurday(xy)
        futurehour(xy)
    
    })
    })
       citysuggestions.classList.remove('hidden')
    },500);

    
    
})

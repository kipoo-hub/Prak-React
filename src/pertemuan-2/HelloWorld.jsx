export default function HelloWorld(){
     const propsUserCard = {
        nama: "Goku",
        nim: "999999",
        tanggal: "2025-01-01"
    }

    return (
        <div>
            <img src="img/logo.png" alt="logo"/>
            <h1>Hello World</h1>
            <p>Hari ini kita belajar React JS lagi bro</p>
            <GreetingBinjai/>
            <QuoteText/>
            <UserCard 
	            nama="Taufiq" 
	            nim="2457301099"
	            tanggal={new Date().toLocaleDateString()}
	          />
               <UserCard {...propsUserCard}/>

               
        </div>
    )
}

function GreetingBinjai(){
    return (
        <small> Salam dari Binjai</small>
    )
}

function QuoteText() {
    const text = "Mulutmu Harimaumu";
    const text2 = "Aku ingin jadi macan";
    return (
        <div>
            <hr/>
            <p>{text.toLowerCase()}</p>
            <p>{text2.toUpperCase()}</p>
        </div>
    )
}

function UserCard(props){
    return (
        <div>
            <hr/>
            <h3>Nama: {props.nama}</h3>
            <p>NIM: {props.nim}</p>
            <p>Tanggal: {props.tanggal}</p>
        </div>
    )
}
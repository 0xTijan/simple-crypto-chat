let subscription;

async function sendMessage(id, chain, tokenAddress, tokenAmount, nft) {
    const user = await Moralis.User.current();
    let messageText = $("#message-input").val();
    let tokenBalance;
    let requiredBalance;
    let ethAddress = user.get("ethAddress");

    if(nft == 0){
        console.log("sending message nft group" + "NFT: " + nft);
        nftBalance = await checkNFTBalance(chain, tokenAddress, ethAddress);
        console.log("NFT balance: " + nftBalance);
    }else{

    }


    if(nft==0){
        console.log("sending message in nft group NFT: " + nft);
        let nftBalance = await checkNFTBalance(chain, tokenAddress, ethAddress);
        console.log("NFT balance: " + nftBalance);
        let messageText = $("#message-input").val();

        if(messageText && messageText.length > 0 && nftBalance >= tokenAmount){

            console.log(messageText);
    
            //Gettting current User:
            let sender = user.get("username");
            let senderId = user.get("id");
            let image = user.get("Image");
    
            //Creatting Object:
            const Message = Moralis.Object.extend("Messages");
            let message = new Message();
    
            message.set("sender", sender);
            message.set("senderId", senderId);
            message.set("text", messageText);
            message.set("group", id);
            message.set("img", image);
            await message.save();
    
            //Consol logging, ...
            console.log(message);
            //console.log(message.getDate());
            $("#message-input").val("");
    
            //Rendering message:
        }else{
            alert("Cannot send message! Empty or insufficient balance 0!");
        }
    }else{ 
        console.log("sending message in not not nft group");
        console.log("chain: " + chain + " token address: " + tokenAddress)
        let token = await Moralis.Cloud.run("getToken", {address: tokenAddress, chain: chain});
        let decimals;
        if(token == undefined) {
            decimals = 18;
        }else{
            decimals = token[0].decimals;
        }
        requiredBalance = tokenAmount / (10**decimals);
        tokenBalance = await checkBalance(chain, tokenAddress, decimals);
        let messageText1 = $("#message-input").val();


        if(messageText1 && messageText1.length > 0){

            console.log(messageText1);
            console.log(tokenBalance >= requiredBalance);
            if(tokenBalance >= requiredBalance){
                //Gettting current User:
                let sender = user.get("username");
                let senderId = user.get("id");
                let image = user.get("Image");
        
                //Creatting Object:
                const Message = Moralis.Object.extend("Messages");
                let message = new Message();
        
                message.set("sender", sender);
                message.set("senderId", senderId);
                message.set("text", messageText1);
                message.set("group", id);
                message.set("img", image);
                await message.save();
        
                //Consol logging, ...
                console.log(message);
                //console.log(message.getDate());
                $("#message-input").val("");
        
                //Rendering message:
            }
        }else{
            alert("Cannot send message! Empty or insufficient balance 0!");
        }
    }

    /*if(messageText && messageText.length > 0 && tokenBalance >= requiredBalance){
        //Gettting current User:
        let sender = user.get("username");
        let image = user.get("Image");

        //Creatting Object:
        const Message = Moralis.Object.extend("Messages");
        let message = new Message();

        message.set("sender", sender);
        message.set("text", messageText);
        message.set("group", id);
        message.set("img", image);
        await message.save();

        $("#message-input").val("");
    }else{
        alert("Cannot send message! Empty or insufficient balance!");
    }*/

}

async function getHistory(id){
    //Getting messeges:
    const Message = Moralis.Object.extend("Messages");
    const query = new Moralis.Query(Message);
    query.equalTo("group", id);
    query.ascending("createdAt");
    query.limit(1000000);
    const results = await query.find();

    $("#chat-div").empty();

    //Displaying messeges:
    for (let i = 0; i < results.length; i++) {
      const object = results[i];

      $("#chat-div").append(`
      <div class=" overflow-auto shadow1 p-2 mb-3" style="">
          <div class="bg-secodnary d-inline-block float-start mt-2 me-2 ">
              <img src="${object.get("img")}" width=30 height=30 style="border: 1px solid black; border-radius: 50%;"/>
              <strong class="fs-6">${object.get("sender")}:</strong>
          </div><br><br>
          <div>
                <p>${object.get("text")}</p>
          </div>
      </div>`);

    }

    scrollToBottom();
}

async function queryMessage(id) {
    if(subscription == undefined){
        let query = new Moralis.Query("Messages");
        subscription = await query.subscribe();

        subscription.on('create', (object) => {
            if(object.get("group") == id){
                $("#chat-div").append(`
                <div class=" overflow-auto shadow1 p-2 mb-3" style="">
                    <div class="bg-secodnary d-inline-block float-start mt-2 me-2 ">
                        <img src="${object.get("img")}" width=30 height=30 style="border: 1px solid black; border-radius: 50%;"/>
                        <strong class="fs-6">${object.get("sender")}:</strong>
                    </div><br><br>
                    <div>
                          <p>${object.get("text")}</p>
                    </div>
                </div>`);

                scrollToBottom();
            }
        })
    }else{
        subscription.unsubscribe();
        let query = new Moralis.Query("Messages");
        subscription = await query.subscribe();

        subscription.on('create', (object) => {
            if(object.get("group") == id){
                $("#chat-div").append(`
                <div class=" overflow-auto shadow1 p-2 mb-3" style="">
                    <div class="bg-secodnary d-inline-block float-start mt-2 me-2 ">
                        <img src="${object.get("img")}" width=30 height=30 style="border: 1px solid black; border-radius: 50%;"/>
                        <strong class="fs-6">${object.get("sender")}:</strong>
                    </div><br><br>
                    <div>
                          <p>${object.get("text")}</p>
                    </div>
                </div>`);

                scrollToBottom();
            }
        })
    }
}

function scrollToBottom() {
    var elem = document.getElementById('chat-div');
    elem.scrollTop = elem.scrollHeight;
}

window.onload = function() {
    Moralis.initialize("eBatNLonO2KHzgxJ81T082IFmwbY4PsbsVsPzWrk");
    Moralis.serverURL = "https://fpqcp09qsfeu.moralisweb3.com:2053/server";
    
    init();
    
    $("#logout-btn").click(function(){
        $("#login").show();
        $("#all").hide();
        logOut();
    });
    
    $("#createGroup-btn").click(function() {
        let checkbox = document.getElementById("checkbox");
        let checkboxState = checkbox.checked;

        if(!checkboxState){
            console.log("btn clicked creating token group"); 
            createGroup(); 
            $("#info2").empty(); 
        }else{
            console.log("btn clicke creating NFT group");
            createNFTGroup();
            $("#info2").empty(); 
        }
    });

    $("#btn-metamask").click(function() { loginMetaMask() });
    $("#btn-walletconnect").click(function() { logInWalletConnect() });
    $("#change-pic-btn").click(function() { updateProfilePic(); $("#info1").empty();});
    $("#change-username-btn").click(function() { updateProfileUsername(); $("#info").empty(); });
    $("#show-balances-btn").click(function() { getTokenBalancesOfUser() });
    $("#send-btn").click(function() { sendMessage() });
    
    
}
    

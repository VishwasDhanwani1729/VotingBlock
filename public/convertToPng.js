document.getElementById("downloadReceipt").addEventListener("click",function(){
    let ele = document.getElementById('receiptData');
    let length="600";
    let width="450";
    let type="png";
    let filename="html2png";
    html2canvas(ele).then(function(canvas){
        Canvas2Image.saveAsPNG(canvas,length,width);
    });
});
$('#download').click(function()
        {
            let ele = $('#element').get(0);
            let length="600";
            let width="450";
            let type="png";
            let filename="html2png";
            html2canvas(ele).then(function(canvas){
                Canvas2Image.saveAsPNG(canvas,length,width);
            });
        });
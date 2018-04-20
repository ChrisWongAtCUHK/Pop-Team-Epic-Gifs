const options = [
    {
        text: "要遲到了",
        value: {
            gifName: "running",
            width: 399,
            height: 224,
            dialogues: ["要遲到了"]
        }
    },
    {
        text: "我不客氣了",
        value: {
            gifName: "eating",
            width: 356, 
            height: 278,
            dialogues: ["我不客氣了", "食食食"]
        },
    },
    {
        text: "刷首抽",
        value: {
            gifName: "brush-first",
            width: 320, 
            height: 180,
            dialogues: ["刷首抽"]
        },
    },
    {
        text: "你叫咩名呀？",
        value: {
            gifName: "your-name",
            width: 320, 
            height: 180,
            dialogues: ["你叫咩名呀？"]
        }
    }
];
new Vue({
    el: "#gif-select",
    data: {
        selected: options[0].value,
        options: options
    },
    computed: {
        gif: function() {
            return "./images/" + this.selected.gifName + ".gif";
        },
        subtitles: function(){
            const labels = [ 
                { "id": "subtitle01", "text": "第一句" },
                { "id": "subtitle02", "text": "第二句" },
                { "id": "subtitle03", "text": "第三句" },
            ];

            let arr = [];
            for(let i = 0; i < this.selected.dialogues.length; i++){
                arr.push({ id: labels[i].id, text: labels[i].text, placeholder: this.selected.dialogues[i] });
            }
            return arr;
        }
    }
});
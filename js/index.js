const dialogues = {
    "running": ["要遲到了"],
    "eating": ["我不客氣了", "食食食"],
    "brush-first": ["刷首抽"],
    "your-name": ["你叫咩名呀？"],
};

const options = [
    {
        text: "要遲到了",
        value: "running"
    },
    {
        text: "我不客氣了",
        value: "eating"
    },
    {
        text: "刷首抽",
        value: "brush-first"
    },
    {
        text: "你叫咩名呀？",
        value: "your-name"
    }
];
new Vue({
    el: "#gif-select-container",
    data: {
        selected: options[0].value,
        options: options
    },
    computed: {
        gif: function() {
            return "./images/" + this.selected + ".gif";
        },
        subtitles: function(){
            const labels = [ 
                { "id": "subtitle01", "text": "第一句" },
                { "id": "subtitle02", "text": "第二句" },
                { "id": "subtitle03", "text": "第三句" },
            ];

            let arr = [];
            for(let i = 0; i < dialogues[this.selected].length; i++){
                arr.push({ id: labels[i].id, text: labels[i].text, placeholder: dialogues[this.selected][i] });
            }
            return arr;
        }
    }
});
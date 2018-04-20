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
    }
});
module.exports = {
    apps: [{
        name: "spiget",
        script: "index.js",
        args: ["--color", "--time"],
        time: true,
        max_memory_restart: "300M"
    }]
}

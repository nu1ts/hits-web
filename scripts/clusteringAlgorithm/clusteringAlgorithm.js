function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width / bbox.width), y: y - bbox.top * (canvas.height / bbox.height) };
}

var canvas = document.getElementById("canvas1");
    ctx = canvas.getContext('2d');
    coords = [];
canvas.width = document.documentElement.clientWidth*0.9905;
canvas.height = document.documentElement.clientHeight*0.85;

canvas.addEventListener('mousedown',
function(e) {
    var loc = windowToCanvas(canvas, e.clientX, e.clientY);
    coords.push([loc.x, loc.y, '']);

    ctx.arc(loc.x, loc.y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
});

function display(K) {
    document.getElementById("K").value = K;
}

function runClusteringAlg()
{
    var K = 0;
    if (document.getElementById('K').value > 10) K = 10;
    else if (document.getElementById('K').value < 2) K = 2;
    K = document.getElementById('K').value;
    display(K);
        centers = [];
        for (i = 0; i<K; i++)
        {
            centers.push([]);
        }
        // coords = coords;
        a = Math.floor(Math.random() * coords.length);
        max = 0;
        min = 0;
        buffer = [];
        colors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'teal', 'aqua', 'fuchsia', 'olive'];

    centers[0] = [coords[a][0], coords[a][1], 0];

    //центры
    for (i = 1; i<centers.length; i++)
    {
        for (j = 0; j<coords.length; j++)
        {
            for (l = 0; l<i; l++)
            {
                buffer.push(Math.hypot(centers[l][0]-coords[j][0], centers[l][1]-coords[j][1]));
            }
            if (Math.min.apply(null, buffer) > max)
            {
                max = Math.min.apply(null, buffer);
                centers[i] = [coords[j][0], coords[j][1], i];
            }
            buffer = [];
        }
        max = 0;
    }
    //распределение
    for (l = 0; l<100; l++)
    {
        for (i = 0; i<coords.length; i++)
        {
            min = Math.hypot(centers[0][0] - coords[i][0], centers[0][1] - coords[i][1]);
            coords[i][2] = centers[0][2];
            for (j = 1; j<centers.length; j++)
            {
                if (Math.hypot(centers[j][0] - coords[i][0], centers[j][1] - coords[i][1]) < min)
                {
                    min = Math.hypot(centers[j][0] - coords[i][0], centers[j][1] - coords[i][1]);
                    coords[i][2] = centers[j][2];
                }
            }
        }
        //пересчет центров
        groups = [];
        k = [];
        for (i = 0; i<K; i++)
        {
            groups.push([0, 0]);
            k.push(0);
        }
        for (i = 0; i<coords.length; i++)
        {
            groups[coords[i][2]][0] += coords[i][0];
            groups[coords[i][2]][1] += coords[i][1];
            k[coords[i][2]]++;
        }
        for (i = 0; i<centers.length; i++)
        {
            groups[i][0] /= k[i];
            groups[i][1] /= k[i];
            min = Math.hypot(groups[i][0] - coords[0][0], groups[i][1] - coords[0][1]);
            centers[i] = [coords[0][0], coords[0][1], i];
            for (j = 1; j<coords.length; j++)
            {
                if (Math.hypot(groups[i][0] - coords[j][0], groups[i][1] - coords[j][1]) < min)
                {
                    min = Math.hypot(groups[i][0] - coords[j][0], groups[i][1] - coords[j][1]);
                    centers[i] = [coords[j][0], coords[j][1], i];
                }
            }
        }
    }
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.beginPath();

    for (i = 0; i<coords.length; i++)
    {
        ctx.fillStyle = colors[coords[i][2]]; 
        ctx.arc(coords[i][0], coords[i][1], 10, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
    }
    
    ctx.fillStyle = 'black';
    ctx.beginPath();

}
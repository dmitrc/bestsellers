var sbox = document.getElementById("sbox");
var count = document.getElementById("count");
var results = document.getElementById("results");

var r = [];
var ri = 0;

function render(item) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    var p = document.createElement('p');

    a.href = item.url;
    a.innerHTML = item.name;

    p.innerHTML = item.cat.join(" -> ");

    li.appendChild(a);
    li.appendChild(p);

    results.appendChild(li);
}

sbox.oninput = function (e) {
    if (!sbox.value) {
        results.innerHTML = "";
        count.innerHTML = "";
        return;
    }

    if (bestsellers) {
        r = matchSorter.default(bestsellers, sbox.value, { keys: ['name'] });
        if (r) {
            results.innerHTML = "";
            count.innerHTML = `${r.length} results found`;

            ri = Math.min(r.length, 10);
            for (var i = 0; i < ri; ++i) {
                render(r[i]);
            }
        }
    }
};
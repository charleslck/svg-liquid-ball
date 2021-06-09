# svg-liquid-ball

smooth liquid ball.

[Preview Demo](https://charleslck.github.io/svg-liquid-ball/)

---



### How to use

> 1. Cdn link

```
<script src="https://cdn.jsdelivr.net/npm/svg-liquid-ball@1.0.0/svg-liquid-ball.js"></script>
```

> 2. Init liquid ball

```
const svgLiquidBox = new SvgLiquidBox({
	eleId: 'liquid-ball',  // element id to render
 	width: 200,  // ball width
        color:  '#f60',  // ball color
	percent: 50,  // full percent
	speed: 0.7, // wave speed
	waveStrong: 0.5, // wave height
	waveLength: 160, // wave length
});
```

---

### Events

##### instanceName.changeColor(color)

> color: 'hex color || rgb color' | **string**

#### instanceName.changePercent(80)

> percent : 30 | **number**

###### Thanks!




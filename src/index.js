/* eslint-disable class-methods-use-this */
import { SVG, Circle } from '@svgdotjs/svg.js';
/* eslint-disable no-undef */
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(global, global.document);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(global, global.document);
  } else {
    global.SvgLiquidBox = factory(global, global.document);
  }
}(typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  let defs = null;
  let circle = null;
  let animateRunner = null;
  const animateDuration = 200;

  class SvgLiquidBox {
    constructor(options) {
      SvgLiquidBox.defaultOption = {
        eleId: options.eleId || 'liquid',
        width: options.width || 200,
        percent: options.percent || 50,
        speed: options.speed || 0.7,
        color: options.color || '#f60',
        waveStrong: options.waveStrong || 0.3,
        waveLength: options.waveLength || 200,
      };
      SvgLiquidBox.checkOption(() => {
        SvgLiquidBox.initLiquidBall();
      });
    }

    // 检查配置项
    static checkOption (callback) {
      try {
        if (this.defaultOption.width < 80) {
          console.error('SvgLiquidBox: The width cannot be less than 80.');
          throw new Error()
        }
        if (this.defaultOption.waveStrong > 1) {
          console.error('SvgLiquidBox: The waveStrong cannot be more than 1.');
          throw new Error()
        }
        if (this.defaultOption.waveLength < this.defaultOption.width / 2) {
          console.error('SvgLiquidBox: The waveLength cannot be less than 1/2 of the width.');
          throw new Error()
        }
        const ele = document.getElementById(this.defaultOption.eleId);
        if (!ele) {
          console.error('SvgLiquidBox: #' + this.defaultOption.eleId + ' is not found.');
          throw new Error()
        }
        callback()
      } catch (error) {

      }
    }

    // 修改球体百分比
    changePercent (percent = 10) {
      const that = SvgLiquidBox;
      const waveLength = that.defaultOption.waveLength;
      animateRunner.unschedule();
      const ballHeight = that.calcBallHeight(percent);
      animateRunner = defs.animate({
        duration: animateDuration,
        times: 1,
      }).ease('<').move(-waveLength, ballHeight);
      animateRunner.after((data) => {
        if (data.type === 'finished') {
          animateRunner.unschedule();
          animateRunner = defs.animate({
            duration: 1500 / that.defaultOption.speed,
            times: true,
          }).ease('-').move(0, ballHeight);
        }
      });
    }

    // 修改球体颜色
    changeColor (color = '#f03') {
      const option = {
        duration: animateDuration,
        when: 'now',
      };
      circle.animate(option).stroke({ color });
      defs.animate(option).attr({ fill: color });
    }

    static calcBallHeight (percent) {
      return this.defaultOption.width * ((100 - percent) / 100);
    }

    static initLiquidBall () {
      // full- 15 、empty - 175
      const ballHeight = this.calcBallHeight(this.defaultOption.percent);
      const waveLength = this.defaultOption.waveLength;
      // 画布
      const draw = SVG().addTo(`#${this.defaultOption.eleId}`).size(this.defaultOption.width, this.defaultOption.width);
      // 外圈圆1
      new Circle({
        rx: 0,
        ry: 0,
        x: 0,
        y: 0,
        cx: this.defaultOption.width / 2,
        cy: this.defaultOption.width / 2,
        width: this.defaultOption.width - 10,
        height: this.defaultOption.width - 10,
      }).size(this.defaultOption.width - 14, this.defaultOption.width - 14)
        .stroke({ color: 'rgba(255,255,255,.2)', width: 5 })
        .fill('transparent')
        .addTo(draw);

      // 外圈圆2
      circle = new Circle({
        rx: 0,
        ry: 0,
        x: 0,
        y: 0,
        cx: this.defaultOption.width / 2,
        cy: this.defaultOption.width / 2,
        width: this.defaultOption.width / 2,
        height: this.defaultOption.width / 2,
      }).size(this.defaultOption.width - 20, this.defaultOption.width - 20)
        .stroke({ color: this.defaultOption.color, width: 2 })
        .fill('transparent')
        .addTo(draw);

      const makePathString = (offsetX = 0, offsetY = 0) => { // 生成单个路径
        let pointString = 'M';
        const dotNumber = 50;
        const p1 = [offsetX, offsetY];
        const p2 = [waveLength + offsetX, 0 + offsetY];
        const c1 = [waveLength / 3 + offsetX, (-30 * (this.defaultOption.waveStrong)) + offsetY];
        const c2 = [(waveLength / 3) * 2 + offsetX, (30 * (this.defaultOption.waveStrong)) + offsetY];
        this.getBezierPoints(dotNumber, p1, c1, c2, p2).forEach((d) => {
          pointString += `${d[0]},${d[1]} `;
        });
        pointString += `${waveLength * 2 + offsetX},${this.defaultOption.width * 2} ${offsetX}, ${this.defaultOption.width * 2}`;
        return pointString;
      };

      const concatPath = (count = 1) => { // 生成组合路径
        let string = '';
        for (let i = 0; i <= count; i += 1) {
          string += makePathString(waveLength * (i - 1), ballHeight);
        }
        return string;
      };

      defs = draw.group();
      defs.path(concatPath(2)).id('liquid-path');
      defs.fill(this.defaultOption.color).id('liquid-group');

      // 裁剪圆
      const circleClip = new Circle({
        cx: this.defaultOption.width / 2,
        cy: this.defaultOption.width / 2,
        width: this.defaultOption.width / 2,
        height: this.defaultOption.width / 2,
      }).size(this.defaultOption.width - 30, this.defaultOption.width - 30)
        .stroke({ width: 6 });
      defs.clipWith(circleClip);

      defs.move(-waveLength, ballHeight);

      animateRunner = defs.animate({
        duration: 1500 / this.defaultOption.speed,
        times: true,
      }).ease('-').move(0, ballHeight);
    }

    static getBezierPoints (num = 100, p1, p2, p3, p4) {
      const func = this.threeBezier;
      const points = [];
      for (let i = 0; i < num; i += 1) {
        points.push(func(i / num, p1, p2, p3, p4));
      }
      if (p4) {
        points.push([...p4]);
      } else if (p3) {
        points.push([...p3]);
      }
      return points;
    }

    static threeBezier (t, p1, cp1, cp2, p2) {
      const [x1, y1] = p1;
      const [x2, y2] = p2;
      const [cx1, cy1] = cp1;
      const [cx2, cy2] = cp2;
      const x = x1 * (1 - t) * (1 - t) * (1 - t)
        + 3 * cx1 * t * (1 - t) * (1 - t)
        + 3 * cx2 * t * t * (1 - t)
        + x2 * t * t * t;
      const y = y1 * (1 - t) * (1 - t) * (1 - t)
        + 3 * cy1 * t * (1 - t) * (1 - t)
        + 3 * cy2 * t * t * (1 - t)
        + y2 * t * t * t;
      return [x, y];
    }
  }

  window.SvgLiquidBox = SvgLiquidBox
}));

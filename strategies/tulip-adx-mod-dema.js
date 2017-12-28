// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// Let's create our own method
var method = {};
// Prepare everything our method needs
method.init = function() {
  this.name = 'tulip-adx-mod-dema'
  this.currentAdvice;

  // ADX init
  this.trend = 'none';
  this.requiredHistory = Math.max(this.settings.historySize, this.tradingAdvisor.historySize);
  this.addTulipIndicator('myadx', 'adx', this.settings);

  log.debug('\t DEMA short:', this.settings, ' long: ',this.settings.long);
  // DEMA init
  this.addIndicator('dema', 'DEMA', {short: this.settings.short, long: this.settings.long});
}
// What happens on every new candle?
method.update = function(candle) {
  // nothing!
}
method.log = function() {
//   var dema = this.indicators.dema;
  
//   log.debug('calculated DEMA properties for candle:');
//   log.debug('\t', 'long ema:', dema.long.result.toFixed(8));
//   log.debug('\t', 'short ema:', dema.short.result.toFixed(8));
//   log.debug('\t diff:', dema.result.toFixed(5));
//   log.debug('\t DEMA age:', dema.short.age, 'candles');
}

method.check = function(candle) {
  var price = candle.close;
  var adx = this.tulipIndicators.myadx.result.result;
  var adx_advice = 'none';
  
  // DEMA CODE
  var dema = this.indicators.dema;
  var diff = dema.result;
  var dema_advice = 'none';

  if(this.settings.thresholds.adxDown > adx) {
    adx_advice='short';
  } else if(this.settings.thresholds.adxUp < adx){
    adx_advice = 'long';
  }
  //DEMA

  if(diff > this.settings.thresholds.demaUp) {
    dema_advice = 'long';
  } else if(diff < this.settings.thresholds.demaDown) {
    dema_advice = 'short';
  }

  advice = 'none'
  if(dema_advice == 'long' && adx_advice == 'short') {
    advice = 'short';
  } else if (dema_advice == adx_advice){
    advice = dema_advice;
  }

  if(this.currentAdvice !== advice && advice !== 'none'){
    this.advice(advice);
    this.currentAdvice = advice;
  }else {
    this.advice();
  }

  log.debug('DEMA: ', dema_advice, ' ADX:', adx_advice, ' Current: ', this.currentAdvice, ' final: ', advice);
}

module.exports = method;

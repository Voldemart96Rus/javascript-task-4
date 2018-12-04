'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var listener = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} obj
         * @returns {any}
         */
        on: function on(event, context, handler, obj) {
            console.info(event, context, handler);
            if (!listener[event]) {
                listener[event] = [];
            }

            var health = Infinity;
            var freq = 1;
            if (obj) {
                health = obj.health || Infinity;
                freq = obj.freq || 1;
            }

            listener[event].push({ context, handler, health, freq, subscribe: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {any}
         */
        off: function (event, context) {
            console.info(event, context);
            var key = Object.keys(listener).filter(evnt => evnt === event ||
                evnt.startsWith(event + '.'));
            for (var i = 0; i < key.length; i++) {
                var keyEvent = Object.keys(listener[key[i]]);
                for (var j = 0; j < keyEvent.length; j++) {
                    this.forOFF(listener, key[i], keyEvent[j], context);
                }

            }

            return this;
        },

        forOFF: function forOFF(listene, event, keyEvent, context) {
            if (listene[event][keyEvent].context === context) {
                delete listene[event][keyEvent];
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {any}
         */
        emit: function emit(event) {
            console.info(event);
            if (listener[event]) {
                var key = Object.keys(listener[event]);
                for (var i = 0; i < key.length; i++) {
                    let listenerEvent = listener[event][key[i]];
                    var through = listenerEvent.subscribe % listenerEvent.freq;
                    this.forEmit(listenerEvent, through);
                    listenerEvent.subscribe++;
                }
            }
            if (event.includes('.')) {
                var t = event.lastIndexOf('.');
                event = event.substring(0, t);
                this.emit(event);
            }

            return this;
        },

        forEmit: function forEmit(list, through) {
            if (list.health && through === 0) {
                list.handler.call(list.context);
                list.health--;
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {any}
         */
        several: function several(event, context, handler, times) {
            console.info(event, context, handler, times);

            return this.on(event, context, handler, { freq: undefined, health: times });
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {any}
         */
        through: function through(event, context, handler, frequency) {
            console.info(event, context, handler, frequency);

            return this.on(event, context, handler, { freq: frequency, health: undefined });
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};

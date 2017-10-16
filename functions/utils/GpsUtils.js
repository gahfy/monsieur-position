'use strict';

const MathUtils = require('./MathUtils').MathUtils;

const EARTH_RADIUS = 6371;

exports.GpsUtils = {
    /**
     * Returns the distance between two GPS coordinates.
     * @param gpsPoint1 object {letitude:l, longitude:L} of the origin point
     * @param gpsPoint2 object {letitude:l, longitude:L} of the destination point
     * @returns {number} the distance between two GPS coordinates
     */
    getDistance: function(gpsPoint1, gpsPoint2) {
        let dLat = MathUtils.toRad(gpsPoint2.latitude-gpsPoint1.latitude);
        let dLon = MathUtils.toRad(gpsPoint2.longitude-gpsPoint1.longitude);

        let lat1 = MathUtils.toRad(gpsPoint1.latitude);
        let lat2 = MathUtils.toRad(gpsPoint2.latitude);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return EARTH_RADIUS * c;
    },

    /**
     * <p>Returns the direction of point2 from point1</p>
     * <p>
     *     Direction is an index of a cardinal point:
     * </p>
     * <dl>
     *     <dt>0</dt><dd>North</dd>
     *     <dt>1</dt><dd>North East</dd>
     *     <dt>2</dt><dd>East</dd>
     *     <dt>3</dt><dd>South East</dd>
     *     <dt>4</dt><dd>South</dd>
     *     <dt>5</dt><dd>South West</dd>
     *     <dt>6</dt><dd>West</dd>
     *     <dt>7</dt><dd>North West</dd>
     * </dl>
     * @param gpsPoint1 object {letitude:l, longitude:L} of the origin point
     * @param gpsPoint2 object {letitude:l, longitude:L} of the destination point
     * @returns {number} the direction of point2 from point1
     */
    getDirection: function(gpsPoint1, gpsPoint2){
        return Math.floor(((this._getDirection(gpsPoint1, gpsPoint2)+22.5)%360)/45);
    },

    _getDirection: function(gpsPoint1, gpsPoint2){
            let dLon = MathUtils.toRad(gpsPoint2.longitude - gpsPoint1.longitude);
            let dPhi = Math.log(
                Math.tan(MathUtils.toRad(gpsPoint2.latitude)/2+Math.PI/4)/Math.tan(MathUtils.toRad(gpsPoint1.latitude)/2+Math.PI/4));
            if (Math.abs(dLon) > Math.PI)
                dLon = dLon > 0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
            return (MathUtils.toDeg(Math.atan2(dLon, dPhi))+360)%360;
    }
};
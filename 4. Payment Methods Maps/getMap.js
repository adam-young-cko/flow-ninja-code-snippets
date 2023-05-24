/* eslint-disable no-param-reassign */
import theme from '@/layouts/themeSettings';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import { geoEckert4 } from 'd3-geo-projection';
/**
 * Two world series are defined.
 * Assuming there will be only two categories of countries
 * ie, Business and Consumer Countries.
 */
let chart;
let worldSeries1;
let worldSeries2;

const getWorldSeries = (countries) => {
  const worldSeries = new am4maps.MapPolygonSeries();
  worldSeries.exclude = ['AQ'];
  worldSeries.useGeodata = true;
  worldSeries.tooltip.getFillFromObject = false;
  worldSeries.tooltip.getStrokeFromObject = false;
  worldSeries.tooltip.background.fill = theme.websiteColors.primaryDark;
  worldSeries.tooltip.background.stroke = theme.websiteColors.primaryDark;
  worldSeries.tooltip.stroke = theme.websiteColors.primaryYellow;

  /**
   * Tooltip properties and map customization
   */
  const polygonTemplate = worldSeries.mapPolygons.template;
  polygonTemplate.tooltipText = '{name}';
  polygonTemplate.stroke = theme.websiteColors.shadesDarkS05;
  polygonTemplate.fill = theme.websiteColors.white;
  polygonTemplate.propertyFields.fill = 'fill';
  polygonTemplate.strokeWidth = 1;

  const names = countries.map((country) => country.name);

  /**
   * Fix for incomplete hover state on countries.
   */
  polygonTemplate.events.on('over', (event) => {
    const isMappedCountry = names.indexOf(event.target?.dataItem?.dataContext?.name) !== -1;
    if (!isMappedCountry) {
      event.target.tooltipText = '';
    } else {
      event.target.fill = theme.websiteColors.primaryDark;
    }
  });

  polygonTemplate.events.on('out', (event) => {
    const isMappedCountry = names.indexOf(event.target?.dataItem?.dataContext?.name) !== -1;
    if (isMappedCountry) {
      event.target.fill = theme.websiteColors.primaryTurqoise;
    }
  });
  /**
   * Two world series for two categories
   */
  worldSeries.data = [...countries];
  if (worldSeries1) {
    worldSeries2 = chart.series.push(worldSeries);
    worldSeries2.hide();
  } else {
    worldSeries1 = chart.series.push(worldSeries);
    worldSeries1.show();
  }
};

const mapCountries = (countries, allCountries = {}) => {
  const array = [];
  countries.forEach((country) => {
    const data = allCountries[country?.toLowerCase()?.trim()];

    if (data) {
      array.push(data);
    }
  });
  return [...array];
};

/**
 * Show and hide world series depending on index
 * 0 for business countries
 * 1 for consumer countries
 * @param {number} index
 */
const UpdateMap = (index) => {
  if (index === 2) {
    worldSeries1.hide();
    worldSeries2.show();
  } else {
    worldSeries2.hide();
    worldSeries1.show();
  }
  return chart;
};

const GetMap = (countries, rtl) => {
  if (!chart?.series?.length) {
    chart = am4core.create('map', am4maps.MapChart);
    am4core.addLicense('CH247871528');
    am4core.addLicense('MP247871528');
    chart.geodata = am4geodata_worldLow;
    chart.rtl = rtl;
    chart.projection.d3Projection = geoEckert4();
    chart.svgContainer.autoResize = false;
  }
  getWorldSeries([...countries]);

  /**
   * Zoom actions and buttons
   */
  const homeButton = new am4core.Button();
  homeButton.events.on('hit', () => {
    chart.goHome();
  });
  chart.zoomControl = new am4maps.ZoomControl();
  chart.zoomDuration = 100;
  homeButton.icon = new am4core.Sprite();
  homeButton.background.fill = theme.websiteColors.white;
  homeButton.background.stroke = theme.websiteColors.primaryDark;
  homeButton.padding(7, 5, 7, 5);
  homeButton.width = 30;
  homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
  homeButton.marginBottom = 10;
  homeButton.parent = chart.zoomControl;
  homeButton.insertBefore(chart.zoomControl.plusButton);
  if (chart) {
    chart.preloader.disabled = true;
    chart.zoomControl.plusButton.background.fill = theme.websiteColors.white;
    chart.zoomControl.minusButton.background.fill = theme.websiteColors.white;
    chart.zoomControl.plusButton.hoverable = false;
    chart.zoomControl.minusButton.hoverable = false;
    chart.zoomControl.plusButton.background.stroke = theme.websiteColors.primaryDark;
    chart.zoomControl.minusButton.background.stroke = theme.websiteColors.primaryDark;
    if (chart.logo) chart.logo.disabled = true;
  }

  return chart;
};

export { GetMap, UpdateMap, mapCountries };

import { useEffect, useState, useRef } from 'react';
import theme from '@/layouts/themeSettings';
import { useTheme } from 'styled-components';

import { GetMap, UpdateMap, mapCountries } from './getMap';

const Map = ({
  // This is all CMS data.
  data: {
    primary: { dark_mode, map_legend_title, legend_label_1, legend_label_2 },
  },
  allCountries,
  facts,
}) => {
  const chart = useRef();
  const [countryMode, setCountryMode] = useState(1);
  const [mappedCountries, setMappedCountries] = useState({});
  const { rtl } = useTheme();

  useEffect(() => {
    // Areas to highlight are built from the `Merchant countries` and `Customer countries` fields in the grid below the map.
    // We split these up into arrays and then map them to the country codes in the `allCountries` object. AM4Charts deals with which areas to highlight.
    const comma = rtl ? '،' : ',';
    const { business_countries, consumer_countries } = facts?.primary ?? {};

    const splitBusinessCountries = business_countries?.[0]?.text?.split(comma) ?? [];
    const splitConsumerCountries = consumer_countries?.[0]?.text?.split(comma) ?? [];

    const mappedBusinessCountries = mapCountries(splitBusinessCountries, allCountries);
    const mappedConsumerCountries = mapCountries(splitConsumerCountries, allCountries);

    setMappedCountries({
      business: mappedBusinessCountries,
      consumer: mappedConsumerCountries,
    });

    /**
     * Creating chart with two series.
     * One Series with Business countries and other with Consumer countries.
     */
    if (mappedBusinessCountries?.length) {
      chart.current = GetMap(mappedBusinessCountries, rtl);
    }

    if (mappedConsumerCountries?.length) {
      if (!mappedBusinessCountries?.length) {
        setCountryMode(2);
      }
      timer = setTimeout(() => {
        chart.current = GetMap(mappedConsumerCountries, rtl);
      }, 1000);
    } else if (mappedBusinessCountries.length === 0) {
      document.getElementById('map-container').style.display = 'none';
    }
  }, [allCountries, facts?.primary, rtl]);

  const onLegendClick = (mode) => {
    chart.current = UpdateMap(mode);
    setCountryMode(mode);
  };

  return (
    <MapContainer id="map-container">
      <LegendWrapper colLg={2} colMd={2} colSm={2} colXs={2}>
        {/* Title */}
        {(mappedCountries?.business?.length > 0 || mappedCountries?.consumer?.length > 0) && (
          <Legend>{map_legend_title?.[0]?.text} -</Legend>
        )}
        {/* First button toggle (Merchant countries) */}
        {mappedCountries?.business?.length > 0 && (
          <Eyebrow
            marginBottom="8px"
            darkMode={dark_mode}
            color={countryMode !== 1 ? theme.websiteColors.shadesDarkS100 : ''}
            onClick={() => {
              onLegendClick(1);
            }}
            backgroundColor={countryMode === 1 ? theme.websiteColors.shadesTurquoiseT10 : theme.websiteColors.white}
            clickable
            title={`${legend_label_1?.[0]?.text} *`}
          />
        )}
        {/* Seconds button toggle (Customer countries) */}
        {mappedCountries?.consumer?.length > 0 && (
          <Eyebrow
            marginBottom="0"
            darkMode={dark_mode}
            color={countryMode !== 2 ? theme.websiteColors.shadesDarkS100 : ''}
            onClick={() => {
              onLegendClick(2);
            }}
            backgroundColor={countryMode === 2 ? theme.websiteColors.shadesTurquoiseT10 : theme.websiteColors.white}
            clickable
            title={legend_label_2?.[0]?.text}
          />
        )}
      </LegendWrapper>

      {/* The map component */}
      <div
        id="map"
        style={{
          width: '100%',
          height: '588px',
        }}
      />
    </MapContainer>
  );
};

export default Map;

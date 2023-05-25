function getThemeFromStorage(cooie) {
    const localStorageData = {
        hue: req.localStorage.getItem('hue'),
        dark_color_lightness: req.localStorage.getItem('dark-color-lightness'),
        light_color_lightness: req.localStorage.getItem('light-color-lightness'),
        white_color_lightness: req.localStorage.getItem('white-color-lightness'),
        sticky_top_left: req.localStorage.getItem('sticky-top-left'),
        sticky_top_right: req.localStorage.getItem('sticky-top-right')
      };
    return localStorageData;
}

module.exports = getThemeFromStorage;
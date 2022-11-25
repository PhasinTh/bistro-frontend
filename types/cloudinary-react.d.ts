declare module 'cloudinary-react' {
    class CloudinaryComponent {
        constructor(props, context) {}

        getChildContext() {}

        render() {}

        getChildTransformations(children) {}

        getTransformations() {}

        normalizeOptions(...options) {}

        getURL(extendedProps) {}

        typesFrom(configParams) {}
    }

    export class CloudinaryContext extends CloudinaryComponent {
        constructor(props, context) {}

        getChildContext() {}

        render() {}
    }

    export class Image extends CloudinaryComponent {
        constructor(props, context) {}

        render() {}

        get window() {}

        componentWillRecieveProps() {}

        prepareState() {}

        handleResize(e) {}

        componentDidMount() {}

        componentWillUnmount() {}

        componentWillUpdate() {}

        findContainerWidth() {}

        applyBreakpoints(width, steps, options) {}

        calc_breakpoint(width, steps) {}

        device_pixel_ratio(roundDpr) {}

        updateDpr(dataSrc) {}

        maxWidth(requiredWidth) {}

        cloudinary_update(url, options) {}
    }

    export class Transformation extends CloudinaryComponent {
        constructor(props) {}

        render() {}
    }

    export class Video extends CloudinaryComponent {
        constructor(props) {}

        render() {}
    }
}

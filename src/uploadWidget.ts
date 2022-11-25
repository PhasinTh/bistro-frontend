export const openWidget = (handler: any) => {
    // create the widget
    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: 'dr7jgcz4b',
            uploadPreset: 'nmurcggo',
            sources: ['local', 'camera'],
            language: 'th',
            text: {
                menu: {
                    files: 'ไฟล์ของฉัน',
                },
                local: {
                    browse: 'เลือกไฟล์',
                },
            },
            multiple: false,
            folder: 'menu',
            showAdvancedOptions: false,
            defaultSource: 'local',
            styles: {
                palette: {
                    window: '#ffffff',
                    sourceBg: '#f4f4f5',
                    windowBorder: '#90a0b3',
                    tabIcon: '#000000',
                    inactiveTabIcon: '#555a5f',
                    menuIcons: '#555a5f',
                    link: '#0433ff',
                    action: '#339933',
                    inProgress: '#0433ff',
                    complete: '#339933',
                    error: '#cc0000',
                    textDark: '#000000',
                    textLight: '#fcfffd',
                },
                fonts: {
                    default: null,
                    'sans-serif': {
                        url: null,
                        active: true,
                    },
                },
            },
        },
        (error: any, result: any) => {
            handler(error, result, widget)
        }
    )
    widget.open()
}

Object.defineProperty(window.screen, 'orientation', {
    value: {
        type: 'portrait-primary',
        angle: 0,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
    },
    writable: true,
    configurable: true,
})

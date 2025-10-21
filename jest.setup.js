// Apply EventEmitter methods to Book and other key classes directly
// This ensures they have the methods before any code runs
beforeAll(() => {
  try {
    // Important classes that need EventEmitter methods
    const classesToMock = [
      './src/book',
      './src/rendition',
      './src/locations',
      './src/managers/default/index',
    ];

    // Add EventEmitter methods to each class's prototype
    classesToMock.forEach((path) => {
      try {
        const ClassModule = require(path);
        const Class = ClassModule.default || ClassModule;

        if (Class && Class.prototype) {
          Class.prototype.emit = jest.fn().mockReturnValue(true);
          Class.prototype.on = jest.fn().mockReturnThis();
          Class.prototype.off = jest.fn().mockReturnThis();
          Class.prototype.once = jest.fn().mockReturnThis();
        }
      } catch (e) {
        // Ignore errors if module can't be required
      }
    });
  } catch (e) {
    // Ignore errors
  }
});

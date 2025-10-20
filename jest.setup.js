// Create an object to store original prototypes for restoration
const originalPrototypes = {};

// Mock EventEmitter as a mixin function
jest.mock('event-emitter', () => {
  const mockEventEmitter = (obj) => {
    // Add event emitter methods to the object or prototype
    if (!obj) return obj;

    // Store original methods if they exist
    if (!originalPrototypes[obj.constructor?.name]) {
      originalPrototypes[obj.constructor?.name] = {
        emit: obj.emit,
        on: obj.on,
        off: obj.off,
        once: obj.once,
      };
    }

    // Define methods at prototype level for classes or directly for objects
    if (obj.prototype) {
      // It's a constructor/class
      obj.prototype.emit = jest.fn().mockReturnValue(true);
      obj.prototype.on = jest.fn().mockReturnThis();
      obj.prototype.off = jest.fn().mockReturnThis();
      obj.prototype.once = jest.fn().mockReturnThis();
    } else {
      // It's an instance/object
      obj.emit = jest.fn().mockReturnValue(true);
      obj.on = jest.fn().mockReturnThis();
      obj.off = jest.fn().mockReturnThis();
      obj.once = jest.fn().mockReturnThis();
    }

    return obj;
  };

  // Return the mocked EventEmitter function
  return mockEventEmitter;
});

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

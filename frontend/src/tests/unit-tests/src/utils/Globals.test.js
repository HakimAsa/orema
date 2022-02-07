import {
  changeCase,
  placeForwardslash,
  capitalize,
  addSuffix,
} from '../../../../utils/Globals';
const exMsg = 'Your input should be a valid string';
const url = 'https://orema.com/api';

// describe('getFiveFellowUrl method tests', () => {
//     it(`should return the backend default url: ${url}`, () => {
//         expect(getFiveFellowUrl()).toBe(url)
//     });
// });

describe('changeCase method tests', () => {
  it('should throw an expection if no argument is passed', () => {
    expect(() => {
      changeCase();
    }).toThrow(exMsg);
  });

  it('should throw an exception if the type of the parameter is not a string', () => {
    expect(() => {
      changeCase(1);
    }).toThrow(exMsg);
  });

  it('should throw an exception if the the parameter is an empty string', () => {
    expect(() => {
      changeCase('');
    }).toThrow(exMsg);
  });

  it('should return a lower case srting if the first input is a valid lowerCase string', () => {
    expect(changeCase('five')).toBe('five');
  });

  it('should return a lower case srting if the first input is a valid upperCase string', () => {
    expect(changeCase('FIVE')).toBe('five');
  });

  it('should return an upper case srting if the first input is a valid lowerCase string and the second input is false', () => {
    expect(changeCase('five', false)).toBe('FIVE');
  });

  it('should return an upper case srting if the first input is a valid upperCase string and the second input is false', () => {
    expect(changeCase('FIVE', false)).toBe('FIVE');
  });
});

describe('placeForwardslash method tests', () => {
  it('should throw an expection if the argument is not an array', () => {
    expect(() => {
      placeForwardslash();
    }).toThrow('Your input array should contain at least one element');
  });

  it('should return a full enpoint url if the input is unique with /input', () => {
    expect(placeForwardslash(true, 'users')).toBe('/users');
  });

  it('should return a full enpoint url if the input is not unique with /input1/input2... and first arg is true', () => {
    expect(placeForwardslash(true, 'users', 'blogs')).toBe(`/users/blogs`);
  });
  it('should return a full enpoint url if the input is not unique with input1/input2... and first arg is false', () => {
    expect(placeForwardslash(false, 'users', 'blogs')).toBe(`users/blogs`);
  });

  it('should remove first / if the url starts with //', () => {
    expect(placeForwardslash(false, '/users', 'blogs')).toBe(`/users/blogs`);
  });
});

describe('capitalize method tests', () => {
  it('should throw an expection if no argument is passed', () => {
    expect(() => {
      capitalize();
    }).toThrow(exMsg);
  });

  it('should throw an exception if the type of the parameter is not a string', () => {
    expect(() => {
      capitalize(1);
    }).toThrow(exMsg);
  });

  it('should throw an exception if the the parameter is an empty string', () => {
    expect(() => {
      capitalize('');
    }).toThrow(exMsg);
  });

  it('should return a value with first character being capitalized if the input is lower case ', () => {
    expect(capitalize('users')).toBe('Users');
  });

  it('should return the same value as input if the input has its first character capitalized', () => {
    expect(capitalize('Users')).toBe('Users');
  });
});

describe('addSuffix method tests', () => {
  it('should throw an expection if no argument is passed', () => {
    expect(() => {
      addSuffix();
    }).toThrow(exMsg);
  });

  it('should throw an exception if the type of the parameter is not a string', () => {
    expect(() => {
      addSuffix(1);
    }).toThrow(exMsg);
  });

  it('should throw an exception if the the parameter is an empty string', () => {
    expect(() => {
      addSuffix('');
    }).toThrow(exMsg);
  });

  it('should return a value with a suffix added at the end of the input if the input is a valid string ', () => {
    expect(addSuffix('user', 's')).toBe('users');
  });

  it('should return the same value as the first input if the second input is not specified', () => {
    expect(addSuffix('Users')).toBe('Users');
  });
});

declare module '*.css' {
  const classNames: {
    [className: string]: string;
  };
  export = classNames;
}

declare module '*.png';

declare namespace google.maps {
  interface MouseEvent {
    vertex?: number;
  }
}

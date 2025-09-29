import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('authToken')

  if(token && !req.url.includes('api/auth/')){

    const cloneReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(cloneReq);
  }
  
  return next(req);
};

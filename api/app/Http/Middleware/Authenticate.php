<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Response;


class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {

            return [
                "status"=> "error",
                "code"=> Response::HTTP_UNAUTHORIZED,
                "message"=> "Session has expired. Please login again.",
                "result"=> null
            ];

            //return route('login');
        }
    }
}

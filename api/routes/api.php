<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('login', 'AuthController@login');



Route::group(['middleware' => 'auth:api'], function ($router) {
    Route::post('logout', 'AuthController@logout');
        
     /* Employee Apis */
     Route::post('emp/add', 'EmployeeController@addEmp');
     Route::post('emp/list', 'EmployeeController@empList');
     Route::post('emp/update', 'EmployeeController@updateEmp');
     Route::post('emp/info', 'EmployeeController@empInfo');
     Route::post('emp/delete', 'EmployeeController@deleteEmp');
     Route::post('emp/username-list', 'EmployeeController@getEmpNameList');


});
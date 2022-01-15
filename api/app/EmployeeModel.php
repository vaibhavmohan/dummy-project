<?php

namespace App;
use DB;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use App\DeviceCatalog;
use App\User;



class EmployeeModel extends Model
{   

    protected $table = 'users';
    protected $primarykey = 'id';


    public static function empList($request){

        $orderBy ='users.updated_at';
        $ordertype = 'desc';

        if (isset($request['sort'])) {
            $orderBy = $request['sort'];
            $ordertype = $request['order'];
        }

        $search = ($request['search'])??null;
        $empData = DB::table('users'); 
       
        return $empData->orderBy($orderBy, $ordertype)->paginate(10);

    }


    public static function filterConditionCreator($filter, $obj)
    {

        foreach ($filter as $key => $value) {
            if ($value == '') {
                continue;
            }

            switch (strtolower($key)) {

                case 'username':
                    $obj->where('code', $value);
                    break;

                case 'email':
                    $obj->where('email', $value);
                    break;


                default:'';
            }
        }

        return $obj;
    }

    public static function addEmp($request){

    	$empList = DB::table('users')->select('code')->where('code', $request['username'])->limit(1)->pluck('username')->toArray();

        if(!empty($empList)) {
            throw new \Exception("Emplyoee with Employee Code ". $empList[0] ." is already exist");
        }

        $user = new User();
    
        $user->name = $request['name'];
        $user->code = $request['username'];
        $user->email = $request['email'];
        $user->contact_number = $request['contact'];
        $user->password = Hash::make($request['password']);

        $user->save();

        return $user;
    }


    public static function updateEmp($request)
    {
        
        $user = new User();

        $user = User::find($request['id'] ?? '');

        $user->name = $request['name'];
        $user->code = $request['username'];
        $user->email = $request['email'];
        $user->contact_number = $request['contact'];
        if($request['password']){
            $user->password = Hash::make($request['password']);  
        }

        $user->save();     
            
            return $user;
    }

    public function getOriginalState($data){
        return $this->where('code', $data->getOriginal('state'))->value('name');
    }

    public static function deleteEmp($request)
    {

        $empList = DB::table('users')->where('id', $request['id'])->limit(1)->pluck('code')->toArray();
       
        if(empty($empList)) {
            throw new \Exception("Employee with Code ". $request['username'] ." is not exist");
        }

        $empList = DB::table('users')->where('id', $request['id'])->delete();
        return $empList;
    }

    public static function getEmpList($request)
    {
        
        $orderBy ='users.updated_at';
        $ordertype = 'desc';

        if (isset($request['sort'])) {
            $orderBy = $request['sort'];
            $ordertype = $request['order'];
        }

        $search = ($request['search'])??null;
        $empData = DB::table('users');
        // dd($search);
        if(!empty($search)){
            $empData = self::filterConditionCreator($search, $empData);
        }
       
        return $empData->orderBy($orderBy, $ordertype)->paginate(10);

        return $empData;
    }

    public static function getEmpIdByEmpCode($value)
    {
        $userData = DB::table('users');
        $userId = $userData->where('code', $value['code'])->value('id');
        
        if (!$userId) {
            if($value['password']==null || $value['password']==""){
                $value['password'] = "password";
            }
        
            $user = new User();
    
            $user->name = $value['name'];
            $user->code = $value['code'];
            $user->email = $value['email'];
            $user->contact_number = $value['contact'];
            $user->password = Hash::make($value['password']);

            $user->save();
            $result = [
                'result' => true,
            ];
            
        }else{
            DB::table('users')->where('id', $userId)->delete();

            if($value['password']==null || $value['password']==""){
                $value['password'] = "password";
            }
        
            $user = new User();
    
            $user->name = $value['name'];
            $user->code = $value['code'];
            $user->email = $value['email'];
            $user->contact_number = $value['contact'];
            $user->password = Hash::make($value['password']);

            $user->save();
            $result = [
                'result' => true,
            ];
        }

        return $result;
    }
}    
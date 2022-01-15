<?php

namespace App\Http\Controllers;

use App\AppVersion;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use stdClass;
use App\Helpers\UtilityHelper;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try{
            $data = $request->all();
            $errs = [];
            
            $Rule = [
                'email' => 'required',
                'password' => 'required'
            ];
            $msg = [
                'email.required' => 'Code Field is Required'
            ];
            $validator = Validator::make($data, $Rule,$msg);

            if ($validator->fails()) {
                throw new \Exception(UtilityHelper::validationErrors($validator->errors()->getMessages(), true));
            }
            
            $credentials = [
                'password' => base64_decode($data['password']),
                'code' => base64_decode($data['email']),
                'is_active' => '1'
            ];
            
            $token = auth()->attempt($credentials);

            if($token){

                return $this->respondWithToken($token, "Login Successfully!");

            }else{
                throw new \Exception("Invalid Credential. Please try again!");
            }

        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNAUTHORIZED,
                'message' => $e->getMessage(),
                'result' => [
                    'errs'=>$errs
                ],
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function logout()
    {
        auth()->logout();
        return response()->json([
            'status' => 'success',
            'code' => Response::HTTP_OK,
            'message' => 'Successfully logged out',
            'result' => null,
        ]);
    }
    protected function respondWithToken($token, $message)
    {
        $user = auth()->user();
        return response()->json([
            'status' => 'success',
            'code' => Response::HTTP_OK,
            'message' => $message,
            'result' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'user_data' => $user->only(['name', 'email', 'contact_number', 'user_address', 'code', 'country', 'city', 'created_at',
                    'warehouse_code', 'id', 'image_path', 'is_active', 'organization_name', 'customer_station', 'participation_type',
                    'latitude', 'longitude', 'state', 'postal_code', 'airport_code', 'type', 'default_password', 'parent_id']),
            ],
        ]);
    }

    public function refresh()
    {
        echo auth()->refresh(); die ;
        return $this->respondWithToken(auth()->refresh(),'Refreh Token');
    }

    public function user(Request $request)
    {
        $user = auth()->user();
        return response()->json([
            'status' => 'success',
            'code' => Response::HTTP_OK,
            'message' => "User Details found.",
            'result' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        try {
            $request = $request->all();
            $user = auth()->user();
            $response = new \stdClass();
            $rule = array(
                'current_password' => 'required',
                'new_password' => 'required|min:8',
                'confirm_password' => 'required|same:new_password',
            );

            $msg = [
                'new_password.min' => 'Password Must Contains Minimum 8 Character',
                'confirm_password.same' => 'Confirm Password And New Password Is Not Same'
            ];
            $validatorBranchCode = Validator::make($request, $rule,$msg);
            if ($validatorBranchCode->fails()) {
                return response()->json([
                    'status' => 'error',
                    'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                    'message' => UtilityHelper::validationErrors($validatorBranchCode->errors()->getMessages(), true),
                    'result' => $validatorBranchCode->errors()->getMessages(),
                ]);
            }

            $Utility = new UtilityHelper();
            $passValidation =  $Utility->validatePassword($request['new_password'],$user->id);


            if(!$passValidation['status']){
                $issue = $passValidation['length']." ".$passValidation['uppercase']." ".$passValidation['lowercase']." ".$passValidation['number']." ".$passValidation['specialChars']." ".$passValidation['previous'];

                throw new \Exception('This Password Can Not Be Saved'.$issue);
            }

            $user_data = User::find($user->id);

            if (!Hash::check($request['current_password'], $user_data->password)) {
                return response()->json([
                    'status' => 'error',
                    'code' => Response::HTTP_UNAUTHORIZED,
                    'message' => 'Current Password Does not Match',
                    'result' => new \stdClass(),
                ]);

            }

            if (Hash::check($request['new_password'], $user_data->password)) {
                return response()->json([
                    'status' => 'error',
                    'code' => Response::HTTP_UNAUTHORIZED,
                    'message' => 'Current Password And New Password Can Not Be Same',
                    'result' => new \stdClass(),
                ]);

            }

            // $passwordStore = $Utility->storePassword( $user_data->password,$user_data->id);
            $user_data->password = Hash::make($request['new_password']);
            $user_data->default_password = '0';
            $user_data->save();

            /* Save Password In Logs */
            // $passLogs = PasswordHis::where(['user_id'=>$user_data->id])
            //     ->first();
            // if($passLogs){
            //     $passLogs = $passLogs->toArray();
            //     if(sizeof($passLogs['histories']) == 5){
            //         unset($passLogs['histories'][0]);
            //     }
            //     $passLogs['histories'][]=$user_data->password;
            //     unset($passLogs['_id'],$passLogs['user_id']);

            //     PasswordHis::where(['user_id'=>$user_data->id])
            //         ->update($passLogs, ['upsert' => true]);
            // }else{
            //     $passLogs['user_id']=$user_data->id;
            //     $passLogs['histories'][]=$user_data->password;
            //     PasswordHis::create($passLogs);
            // }

            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Successfully Changed   Password.',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }
    }

    // public function validatePassword($password, $user_id){
    //     $res = ['status'=>false,'msg'=>''];
    //     $uppercase = preg_match('@[A-Z]@', $password);
    //     if(!$uppercase){
    //         return [
    //             'status'=>false,'msg'=>'New Password Must Contain One Capital Alphabet'
    //         ];
    //     }
    //     $lowercase = preg_match('@[a-z]@', $password);
    //     if(!$lowercase){
    //         return [
    //             'status'=>false,'msg'=>'New Password Must Contain One Small Alphabet'
    //         ];
    //     }
    //     $number = preg_match('@[0-9]@', $password);
    //     if(!$number){
    //         return [
    //             'status'=>false,'msg'=>'New Password Must Contain One Number'
    //         ];
    //     }
    //     $specialChars = preg_match('@[^\w]@', $password);
    //     if(!$specialChars){
    //         return [
    //             'status'=>false,'msg'=>'New Password Must Contain One Special Character'
    //         ];
    //     }

    //     /* Check From 5 History Password */
    //     $passLogs = PasswordHis::where(['user_id'=>$user_id])
    //         ->first();

    //     if($passLogs){
    //         $passLogs = $passLogs->toArray();
    //         foreach($passLogs['histories'] as $row){
    //             if(Hash::check($password, $row)){
    //                 return [
    //                     'status'=>false,
    //                     'msg'=>"You Can't Use Your Previous Password"
    //                 ];
    //             }
    //         }

    //     }

    //     return ['status'=>true];
    // }


    public function isVersionUpdated(Request $request)
    {
        $data = $request->all();

        $appVersionModel = new AppVersion();
        $is_latest_version = $appVersionModel->where('current_version', $data['version'])->count();
        // sleep(7);
        if ($is_latest_version) {
            return ["status" => true];
        } else {
            return ["status" => false];
        }
    }
}

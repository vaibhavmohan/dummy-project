<?php

namespace App\Http\Controllers;

use App\AppVersion;
use App\User;
use App\EmployeeModel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use stdClass;
use App\Helpers\UtilityHelper;
use App\Exports\EmpMasterExport;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    
    public function empList(Request $request) {
        $data = $request->all();
        $user = auth()->user();
        
        try {
            
            
            $empData = EmployeeModel::empList($data);
            
            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Employee List Successfully Fetched',
                'result' => $empData
            ]);
        
        
        } catch (\Exception $e) {
            dd($e);
            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }
    
    }
    

    public function addEmp(Request $request) {
        $data = $request->all();
        $user = auth()->user();

        try {


            $Rule = array(
                'name' => 'required',
                'username' => 'required',
                'email' => 'required',
                'contact' => 'required',
                'password' => 'required',
                'conf_password' => 'required',
            );

            $msg = [
                'name.required' => 'Name field is required.',
                'username.required' => 'Employee Code field is required.',
                'email.required' => 'Email field is required.',
                'contact.required' => 'Contact field is required.',
                'password.required' => 'Password field is required.',
                'conf_password.required' => 'Confirm Password field is required.',
            ];

            $validatorBranchCode = Validator::make($data, $Rule,$msg);
            if ($validatorBranchCode->fails()) {
                return response()->json([
                    'status' => 'error',
                    'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                    'message' => UtilityHelper::validationErrors($validatorBranchCode->errors()->getMessages(), true),
                    'result' => $validatorBranchCode->errors()->getMessages(),
                ]);
            }

            if($data['conf_password']!=$data['password']){
                throw new \Exception("Confirm Password is not matched.");
            }
        

            $empData = EmployeeModel::addEmp($data);
            

            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Employee Successfully Added',
                'result' => $empData,
            ]);
        
        
        } catch (\Exception $e) {
            // Log::error('Add State request issue ', ['Exception ' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }

    }


    public function deleteEmp(Request $request) {
        $data = $request->all();
        $user = auth()->user();
        
        try {


            $Rule = array(
                'id' => 'required',
            );

            $msg = [
                'id.required' => 'Id field is required.',
            ];
            
            $validatorBranchCode = Validator::make($data, $Rule,$msg);
            if ($validatorBranchCode->fails()) {
                return response()->json([
                    'status' => 'error',
                    'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                    'message' => UtilityHelper::validationErrors($validatorBranchCode->errors()->getMessages(), true),
                    'result' => $validatorBranchCode->errors()->getMessages(),
                ]);
            }

            $empData = EmployeeModel::deleteEmp($data);

            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Employee Successfully Deleted',
                'result' => $empData,
            ]);
        
        
        } catch (\Exception $e) {
            // Log::error('Delete State request issue ', ['Exception ' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }

    }


    public function updateEmp(Request $request) {
        $data = $request->all();
        $user = auth()->user();

        try {


            $Rule = array(
                'name' => 'required',
                'username' => 'required',
                'email' => 'required',
                'contact' => 'required',
                // 'company' => 'required',
                'branch' => 'required',
                // 'device' => 'required',
                // 'password' => 'required',
                // 'conf_password' => 'required',
            );

            $msg = [
                'name.required' => 'Name field is required.',
                'username.required' => 'Employee Code field is required.',
                'email.required' => 'Email field is required.',
                'contact.required' => 'Contact field is required.',
                // 'company.required' => 'Company field is required.',
                'branch.required' => 'Branch field is required.',
                // 'device.required' => 'Device field is required.',
                // 'password.required' => 'Password field is required.',
                // 'conf_password.required' => 'Confirm Password field is required.',
            ];

            $validatorBranchCode = Validator::make($data, $Rule,$msg);
            if ($validatorBranchCode->fails()) {
                return response()->json([
                    'status' => 'error',
                    'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                    'message' => UtilityHelper::validationErrors($validatorBranchCode->errors()->getMessages(), true),
                    'result' => $validatorBranchCode->errors()->getMessages(),
                ]);
            }

            if($data['conf_password'] || $data['password']){
                if($data['conf_password']!=$data['password']){
                    throw new \Exception("Confirm Password is not matched.");
                }
            }
        

            $updateData = EmployeeModel::updateEmp($data);
            

            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Employee Successfully Upadted',
                'result' => $updateData,
            ]);
        
        
        } catch (\Exception $e) {
            // Log::error('Upadte State request issue ', ['Exception ' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }

    }

    public function empInfo(Request $request){
        try {
            $data = $request->all();
            
            $empData = EmployeeModel::getEmpList($data);

            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Employee List Successfully ',
                'result' => $empData,
            ]);

        }catch(\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }
    }

    public function getEmpNameList(Request $request){
        try {
            $data = $request->all();
            $orderBy ='users.updated_at';
            $ordertype = 'desc';
            
            $empData = EmployeeModel::orderBy($orderBy, $ordertype)->get(['id', 'name' , 'code']);

            return response()->json([
                'status' => 'success',
                'code' => Response::HTTP_OK,
                'message' => 'Employee List Successfully ',
                'result' => $empData,
            ]);

        }catch(\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => $e->getMessage(),
                'result' => new stdClass(),
            ]);
        }
    }

    public function failureSuccessStatus($value)
    {
        try {

            $user = EmployeeModel::getEmpIdByEmpCode($value);

        } catch (\Exception $e) {
            return [
                'message' => $e->getMessage(),
                'result' => false,
            ];
        }
    }
}

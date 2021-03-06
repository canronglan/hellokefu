<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ApiException;
use App\Http\Requests\VisitorRequest;
use App\Http\Resources\VisitorResource;
use App\Models\Application;
use App\Models\Visitor;
use App\Services\UserService;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;

class VisitorController extends ApiController
{
    /**
     * 访客列表
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        return $this->success(VisitorResource::collection(Visitor::where('user_id', $this->user->id)->when(!empty($request->updated_at), function ($query) {
            return $query->orderBy('updated_at', SORT_DESC);
        })->orderBy('id', SORT_DESC)->paginate($this->perPage)));
    }

    /**
     *
     * @param Visitor $visitor
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Visitor $visitor)
    {
        return $this->success(new VisitorResource($visitor));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * 创建访客并分配客服-
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(VisitorRequest $request)
    {
        try {
            $appUuid = $request->input('app_uuid', null);
            $visitorId = $request->input('vid', null);

            if ($visitor = Visitor::where(['visitor_id' => $visitorId, 'app_uuid' => $appUuid])->first()) {
                // 更新访问次数
                $visitor->visit_number += 1;
                $visitor->save();
            }

            if (is_null($visitor)) {
                $app = Application::where(['app_uuid' => $appUuid])->first();
                // 直接分配给管理员-暂时这么写
                $admin = UserService::getAdminByAppId($app->id);

                $visitor = Visitor::create([
                    'visitor_id' => (string)Uuid::generate(),
                    'avatar' => UserService::generateAvatar(),
                    'user_id' => $admin->id,
                    'app_uuid' => $appUuid,
                    'ip' => $request->getClientIp(),
                    'user_agent' => 'user_agent',
                    'name' => '访客 ' . (Visitor::where(['app_uuid' => $app->app_uuid])->count() + 1)
                ]);
            }

            return $this->success(new VisitorResource($visitor));

        } catch (ApiException $e) {
            return $this->error($e->getMessage());
        }
    }
}
